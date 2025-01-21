let activas = [];
let no_activas = [];

// Función para obtener el estado de las terminales desde el servidor
async function obtenerEstados() {
  try {
    const response = await fetch('/estado');  // Realiza la solicitud al servidor Express
    const data = await response.json();

    // Actualiza las listas de terminales activas y no activas
    activas = data.activas;
    no_activas = data.no_activas;

    mostrar('activas');
  } catch (error) {
    console.error("Error al obtener el estado de las terminales:", error);
  }
}

// Función para mostrar los resultados
function mostrar(tipo) {
  const content = document.getElementById("content");
  let html = "";
  if (tipo === "activas" || tipo === "no_activas") {
    const lista = tipo === "activas" ? activas : no_activas;
    html += `
      <table>
        <thead>
          <tr>
            <th>Sucursal</th>
            <th>IP</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
    `;
    lista.forEach(t => {
      html += `
        <tr>
          <td>${t.sucursal}</td>
          <td>${t.ip}</td>
          <td><span class="status ${tipo === "activas" ? "online" : "offline"}">${tipo === "activas" ? "En línea" : "Fuera de línea"}</span></td>
        </tr>
      `;
    });
    html += "</tbody></table>";
  } else if (tipo === "general") {
    html += `
      <h2>Resumen General</h2>
      <p>Terminales Activas: ${activas.length}</p>
      <p>Terminales No Activas: ${no_activas.length}</p>
    `;
  }
  content.innerHTML = html;
}

// Actualiza el estado cada 30 segundos
setInterval(obtenerEstados, 30000);

// Inicia la actualización de estados al cargar la página
obtenerEstados();
