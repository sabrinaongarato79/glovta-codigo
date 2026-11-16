package com.glovta.app;

import org.json.JSONObject;
import java.net.URL;
import javax.net.ssl.HttpsURLConnection;
import java.nio.charset.StandardCharsets;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;

final class AuthClient {
    static JSONObject signIn(String email, String password) throws Exception {
        if (BuildConfig.AUTH_URL.isEmpty() || BuildConfig.AUTH_PUBLIC_KEY.isEmpty()) {
            throw new Exception("El acceso estará disponible cuando terminemos de configurar el servicio.");
        }
        URL endpoint = new URL(BuildConfig.AUTH_URL + "/auth/v1/token?grant_type=password");
        HttpsURLConnection connection = (HttpsURLConnection) endpoint.openConnection();
        try {
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(15000);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("apikey", BuildConfig.AUTH_PUBLIC_KEY);
            connection.setDoOutput(true);
            byte[] body = new JSONObject().put("email", email).put("password", password)
                    .toString().getBytes(StandardCharsets.UTF_8);
            try (java.io.OutputStream output = connection.getOutputStream()) {
                output.write(body);
            }
            int status = connection.getResponseCode();
            if (status == 400 || status == 401) {
                throw new Exception("Revisá tu correo y contraseña.");
            }
            if (status == 429) {
                throw new Exception("Esperá unos minutos antes de volver a intentar.");
            }
            if (status != 200) {
                throw new Exception("El servicio no está disponible. Intentá nuevamente.");
            }
            try (InputStream input = connection.getInputStream();
                 ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[4096];
                int count;
                while ((count = input.read(buffer)) != -1) {
                    output.write(buffer, 0, count);
                    if (output.size() > 65536) throw new Exception("Respuesta del servicio inválida.");
                }
                JSONObject response = new JSONObject(output.toString("UTF-8"));
                if (response.optString("access_token").isEmpty()) {
                    throw new Exception("No se pudo verificar la sesión.");
                }
                return response;
            }
        } finally {
            connection.disconnect();
        }
    }

    static JSONObject loadProfile(JSONObject session) throws Exception {
        String userId = java.util.UUID.fromString(session.getJSONObject("user").getString("id")).toString();
        URL endpoint = new URL(BuildConfig.AUTH_URL + "/rest/v1/profiles?select=full_name,headline,location,bio&id=eq." + userId);
        HttpsURLConnection connection = (HttpsURLConnection) endpoint.openConnection();
        try {
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(15000);
            connection.setRequestProperty("apikey", BuildConfig.AUTH_PUBLIC_KEY);
            connection.setRequestProperty("Authorization","Bearer " + session.getString("access_token"));
            if (connection.getResponseCode() != 200) throw new Exception("No se pudo cargar el perfil. Volvé a ingresar para reintentar.");
            try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder json = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    json.append(line);
                    if (json.length() > 32000) throw new Exception("El servicio devolvió un perfil inválido.");
                }
                return new org.json.JSONArray(json.toString()).optJSONObject(0);
            }
        } finally {
            connection.disconnect();
        }
    }
}
