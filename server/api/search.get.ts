import { like, or } from 'drizzle-orm';
import { db } from '../db';
import { recipes } from '../db/schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchTerm = query.q as string;

  if (!searchTerm) {
    return [];
  }

  const searchPattern = `%${searchTerm}%`;

  const results = await db
    .select()
    .from(recipes)
    .where(
      or(
        like(recipes.title, searchPattern),
        like(recipes.description, searchPattern),
        like(recipes.instructions, searchPattern)
      )
    )
    .limit(50);

  return results;
});
