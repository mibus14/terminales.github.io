const ping = require('ping');

const terminales = [
  { sucursal: "SAME", ip: "10.197.128.98" },
  { sucursal: "SAME", ip: "10.197.128.99" },
  { sucursal: "VDME", ip: "10.197.3.242" },
  { sucursal: "VDME", ip: "10.197.47.243" },
];

async function testPing() {
  for (const terminal of terminales) {
    try {
      const estado = await ping.promise.probe(terminal.ip);
      console.log(`${terminal.ip} is ${estado.alive ? 'alive' : 'dead'}`);
    } catch (error) {
      console.error(`Error al hacer ping a ${terminal.ip}:`, error);
    }
  }
}

testPing();
