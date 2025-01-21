import spark.Spark;

import java.io.IOException;
import java.net.InetAddress;
import java.util.Timer;
import java.util.TimerTask;

public class PingServer {
    private static boolean lastPingResult = false; // Resultados anteriores del ping

    public static void main(String[] args) {
        // Configuración del servidor Spark
        Spark.port(4567);

        // Realizar el ping automáticamente cada 10 segundos
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                String ip = "10.197.8.242";  // Dirección IP a la que hacer ping, puedes cambiarla por la que desees
                lastPingResult = pingServer(ip);
            }
        }, 0, 10000); // Ejecutar cada 10 segundos

        // Ruta para obtener el resultado del ping
        Spark.get("/ping-status", (req, res) -> {
            res.type("application/json");
            if (lastPingResult) {
                return "{\"status\": \"success\"}";
            } else {
                return "{\"status\": \"failure\"}";
            }
        });

        Spark.init();
    }

    private static boolean pingServer(String ip) {
        try {
            InetAddress inet = InetAddress.getByName(ip);
            return inet.isReachable(2000);  // Espera hasta 2 segundos para la respuesta
        } catch (IOException e) {
            return false;
        }
    }
}
