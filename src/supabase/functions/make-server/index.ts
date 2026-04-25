import app from '../server/index.tsx';

Deno.serve(app.fetch);
