import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { recipes, ingredients, recipeTags, tags } from '../../db/schema';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Recipe ID is required',
    });
  }

  const recipeId = parseInt(id);

  // Get recipe
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, recipeId),
  });

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Recipe not found',
    });
  }

  // Get ingredients
  const recipeIngredients = await db.query.ingredients.findMany({
    where: eq(ingredients.recipeId, recipeId),
    orderBy: (ingredients, { asc }) => [asc(ingredients.order)],
  });

  // Get tags
  const recipesWithTags = await db
    .select({
      tagId: recipeTags.tagId,
      tagName: tags.name,
    })
    .from(recipeTags)
    .innerJoin(tags, eq(recipeTags.tagId, tags.id))
    .where(eq(recipeTags.recipeId, recipeId));

  return {
    ...recipe,
    ingredients: recipeIngredients,
    tags: recipesWithTags.map(t => ({ id: t.tagId, name: t.tagName })),
  };
});
