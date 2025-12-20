package com.chronos.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

import java.net.Socket;

@Component
public class PortConfig implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    private static final int START_PORT = 8080;
    private static final int MAX_PORT = 8099;

    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        int configuredPort = factory.getPort();
        int port = findAvailablePort(configuredPort);
        
        if (port != configuredPort) {
            System.out.println("警告: 端口 " + configuredPort + " 已被占用，自动切换到端口 " + port);
        }
        
        factory.setPort(port);
        System.out.println("========================================");
        System.out.println("服务器启动在端口: " + port);
        System.out.println("API地址: http://localhost:" + port + "/api");
        System.out.println("========================================");
    }

    private int findAvailablePort(int startPort) {
        for (int port = startPort; port <= MAX_PORT; port++) {
            if (isPortAvailable(port)) {
                return port;
            }
        }
        throw new RuntimeException("无法找到可用端口 (范围: " + startPort + "-" + MAX_PORT + ")");
    }

    private boolean isPortAvailable(int port) {
        try (Socket socket = new Socket("localhost", port)) {
            // 如果能连接，说明端口被占用
            return false;
        } catch (Exception e) {
            // 连接失败，说明端口可用
            return true;
        }
    }
}

