import { db } from '../db';
import { tags } from '../db/schema';

export default defineEventHandler(async () => {
  const allTags = await db.query.tags.findMany({
    orderBy: (tags, { asc }) => [asc(tags.name)],
  });

  return allTags;
});
