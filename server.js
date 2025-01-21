const express = require('express');
const ping = require('ping');
const cors = require('cors');  // Necesitas instalar CORS

const app = express();
const port = 3000;

app.use(cors());  // Habilitar CORS
app.use(express.static('public'));

const terminales = [
  { sucursal: "SAME", ip: "10.197.128.98" },
  { sucursal: "SAME", ip: "10.197.128.99" },
  { sucursal: "VDME", ip: "10.197.3.242" },
  { sucursal: "VDME", ip: "10.197.47.243" },
];

async function obtenerEstadoTerminales() {
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
    }
  }

  return { activas, no_activas };
}

app.get('/estado', async (req, res) => {
  const estado = await obtenerEstadoTerminales();
  res.json(estado);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
