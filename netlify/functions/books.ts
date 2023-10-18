import { Config, Context } from '@netlify/functions';
import { createHash } from 'crypto';
import csv from 'csvtojson';

export default async (req: Request, context: Context) => {
  const { id } = context.params;
  console.log(`Looking up ${id || 'all books'}...`);
  const etag = createHash('md5')
  .update(id || 'all')
  .digest('hex');

  const headers = {
    'Cache-Control': 'public, max-age=0, must-revalidate', // Tell browsers to always revalidate
    'Netlify-CDN-Cache-Control': 'public, max-age=31536000, must-revalidate', // Tell Edge to cache asset for up to a year
    'Cache-Tag': `books,promotions`,
    ETag: `"${etag}"`,
  };

  if (req.headers.get('if-none-match') === etag) {
    return new Response('Not modified', { status: 304, headers });
  }
  const { origin } = new URL(req.url);
  const response = await fetch(`${origin}/books.csv`);
  const csvContent = await response.text();
  const books = await csv().fromString(csvContent);

  if (id) {
    const book = books.find(b => b.id === id);
    if (!book) {
      return Response.json(book, { headers });
    }
    return Response.json(books, { headers });
  }

  return Response.json(books);
};

export const config: Config = {
  method: 'GET',
  path: '/api/books{/:id}?',
};