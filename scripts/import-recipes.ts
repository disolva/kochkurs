#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { recipes, tags, recipeTags, ingredients } from '../server/db/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('./data/recipes.db');
const db = drizzle(sqlite);

interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

interface RecipeData {
  title: string;
  description?: string;
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients?: Ingredient[];
  tags?: string[];
}

/**
 * Recipe JSON format expected:
 * {
 *   "title": "Recipe Title",
 *   "description": "Recipe description",
 *   "instructions": "Step by step instructions",
 *   "prepTime": 15,
 *   "cookTime": 30,
 *   "servings": 4,
 *   "ingredients": [
 *     { "name": "Ingredient name", "quantity": "2", "unit": "cups" }
 *   ],
 *   "tags": ["tag1", "tag2"]
 * }
 */

async function importRecipe(recipeData: RecipeData) {
  console.log(`Importing recipe: ${recipeData.title}`);

  try {
    // Check if recipe already exists by title
    const existingRecipe = await db.select().from(recipes).where(eq(recipes.title, recipeData.title)).limit(1);
    
    let recipeId: number;
    
    if (existingRecipe.length > 0) {
      // Update existing recipe
      recipeId = existingRecipe[0].id;
      await db.update(recipes)
        .set({
          description: recipeData.description || null,
          instructions: recipeData.instructions,
          prepTime: recipeData.prepTime || null,
          cookTime: recipeData.cookTime || null,
          servings: recipeData.servings || null,
          updatedAt: new Date(),
        })
        .where(eq(recipes.id, recipeId));
      
      // Delete existing ingredients and tags
      await db.delete(ingredients).where(eq(ingredients.recipeId, recipeId));
      await db.delete(recipeTags).where(eq(recipeTags.recipeId, recipeId));
      
      console.log(`  ✓ Updated existing recipe (ID: ${recipeId})`);
    } else {
      // Insert new recipe
      const result = await db.insert(recipes).values({
        title: recipeData.title,
        description: recipeData.description || null,
        instructions: recipeData.instructions,
        prepTime: recipeData.prepTime || null,
        cookTime: recipeData.cookTime || null,
        servings: recipeData.servings || null,
      }).returning();
      
      recipeId = result[0].id;
      console.log(`  ✓ Created new recipe (ID: ${recipeId})`);
    }

    // Insert ingredients
    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      for (let i = 0; i < recipeData.ingredients.length; i++) {
        const ingredient = recipeData.ingredients[i];
        await db.insert(ingredients).values({
          recipeId,
          name: ingredient.name,
          quantity: ingredient.quantity || null,
          unit: ingredient.unit || null,
          order: i,
        });
      }
      console.log(`  ✓ Imported ${recipeData.ingredients.length} ingredients`);
    }

    // Insert tags
    if (recipeData.tags && recipeData.tags.length > 0) {
      for (const tagName of recipeData.tags) {
        // Get or create tag
        let tagResult = await db.select().from(tags).where(eq(tags.name, tagName)).limit(1);
        let tagId: number;
        
        if (tagResult.length > 0) {
          tagId = tagResult[0].id;
        } else {
          const newTag = await db.insert(tags).values({ name: tagName }).returning();
          tagId = newTag[0].id;
        }
        
        // Link recipe to tag
        await db.insert(recipeTags).values({
          recipeId,
          tagId,
        });
      }
      console.log(`  ✓ Imported ${recipeData.tags.length} tags`);
    }

    return true;
  } catch (error: any) {
    console.error(`  ✗ Error importing recipe: ${error.message}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npm run import <path-to-json-file-or-directory>');
    process.exit(1);
  }

  const inputPath = args[0];
  
  try {
    const stats = statSync(inputPath);
    
    let files: string[] = [];
    if (stats.isDirectory()) {
      const dirFiles = readdirSync(inputPath);
      files = dirFiles
        .filter(f => f.endsWith('.json'))
        .map(f => join(inputPath, f));
    } else if (inputPath.endsWith('.json')) {
      files = [inputPath];
    } else {
      console.error('Error: Input must be a JSON file or directory containing JSON files');
      process.exit(1);
    }

    if (files.length === 0) {
      console.error('Error: No JSON files found');
      process.exit(1);
    }

    console.log(`Found ${files.length} recipe file(s) to import\n`);

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const recipeData = JSON.parse(content) as RecipeData;
        
        const success = await importRecipe(recipeData);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error: any) {
        console.error(`Error reading file ${file}: ${error.message}`);
        failCount++;
      }
      console.log('');
    }

    console.log(`\nImport complete: ${successCount} succeeded, ${failCount} failed`);
    
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

main();
