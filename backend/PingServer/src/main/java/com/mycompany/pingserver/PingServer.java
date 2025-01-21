package pingserver;

import static spark.Spark.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

public class PingServer {

    public static void main(String[] args) {
        // Configuración de Spark para escuchar en el puerto 4567
        port(4567);

        // Lista de terminales (sucursales e IPs)
        Map<String, String> terminales = new HashMap<>();
        terminales.put("SAME1", "10.197.128.98");
        terminales.put("SAME2", "10.197.128.99");
        terminales.put("VDME1", "10.197.47.242");
        terminales.put("VDME2", "10.197.47.243");

        // Ruta para obtener el estado de todas las terminales
        get("/estado", (req, res) -> {
            StringBuilder result = new StringBuilder();
            for (Map.Entry<String, String> entry : terminales.entrySet()) {
                String sucursal = entry.getKey();
                String ip = entry.getValue();
                boolean estado = pingServer(ip);
                result.append(String.format("Sucursal: %s, IP: %s, Estado: %s\n", sucursal, ip, estado ? "En línea" : "Fuera de línea"));
            }
            return result.toString();
        });

        // Ruta para verificar el estado de una terminal en específico
        get("/estado/:sucursal", (req, res) -> {
            String sucursal = req.params(":sucursal");
            String ip = terminales.get(sucursal);
            if (ip == null) {
                return "Sucursal no encontrada";
            }
            boolean estado = pingServer(ip);
            return String.format("Sucursal: %s, IP: %s, Estado: %s", sucursal, ip, estado ? "En línea" : "Fuera de línea");
        });

        // Ruta para consultar el estado de la aplicación
        get("/status", (req, res) -> "Servidor en funcionamiento");
    }

    // Método para realizar un ping a una IP
    private static boolean pingServer(String ip) {
        try {
            Process process = Runtime.getRuntime().exec("ping -n 1 " + ip);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.contains("TTL")) {
                    return true; // El servidor está en línea
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false; // El servidor no está en línea
    }
}
