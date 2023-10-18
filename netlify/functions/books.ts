import { Config, Context } from '@netlify/functions';
import csv from 'csvtojson';

export default async (req: Request, context: Context) => {
  const { id } = context.params;
  console.log(`Looking up ${id || 'all books'}...`);
  const { origin } = new URL(req.url);
  const response = await fetch(`${origin}/books.csv`);
  const csvContent = await response.text();
  const books = await csv().fromString(csvContent);

  if (id) {
    const book = books.find(b => b.id === id);
    if (!book) {
      return new Response('Not found', { status: 404 });
    }
    return Response.json(book);
  }

  return Response.json(books);
};

export const config: Config = {
  method: 'GET',
  path: '/api/books{/:id}?',
};