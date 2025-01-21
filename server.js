const express = require('express');
const ping = require('ping');
const app = express();
const port = 3000;

const terminales = [
  { sucursal: "SAME", ip: "10.197.128.98" },
  { sucursal: "SAME", ip: "10.197.128.99" },
  { sucursal: "VDME", ip: "10.197.47.242" },
  { sucursal: "VDME", ip: "10.197.47.243" },
  // Agrega las demás terminales aquí...
];

app.use(express.static('public'));  // Para servir archivos estáticos como el HTML

app.get('/estado', async (req, res) => {
  let activas = [];
  let no_activas = [];

  for (const terminal of terminales) {
    try {
      const estado = await ping.promise.probe(terminal.ip);
      if (estado.alive) {
        activas.push(terminal);
      } else {
        no_activas.push(terminal);
      }
    } catch (error) {
      console.error(`Error al hacer ping a ${terminal.ip}:`, error);
      no_activas.push(terminal);
    }
  }

  res.json({ activas, no_activas });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
