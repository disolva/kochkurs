import { db } from '../../db';
import { recipes } from '../../db/schema';

export default defineEventHandler(async () => {
  const allRecipes = await db.query.recipes.findMany({
    orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
  });

  return allRecipes;
});
