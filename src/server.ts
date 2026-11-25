import app from './app.js';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Documentation : http://localhost:${PORT}/api/docs`);
});
