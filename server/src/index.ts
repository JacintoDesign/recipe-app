import app from './app.js';

const port = Number(process.env.PORT ?? 5174);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
