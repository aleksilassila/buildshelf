package me.aleksilassila.litematica.library;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import fi.dy.masa.litematica.data.DataManager;
import org.jetbrains.annotations.Nullable;

import java.io.File;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Api {
    private String token;
    private UUID uuid;
    private String mcAccessToken;
    public static final String ENDPOINT = "http://127.0.0.1:9000/api";

    private static final HttpClient client = HttpClient.newHttpClient();

    private boolean connected;

    public void connect(UUID uuid, String mcAccessToken) {
        CompletableFuture.supplyAsync(()-> authenticate(uuid, mcAccessToken)).thenAccept(s -> {
            this.token = s;
            this.connected = s != null;
        });
    }

    private String authenticate(UUID uuid, String mcAccessToken) {
        JsonObject object = new JsonObject();
        object.addProperty("accessToken", mcAccessToken);
        object.addProperty("uuid", uuid.toString());

        System.out.println("Authenticating...");
        HttpResponse<String> res = wait(post("/login/token", object));

        if (res != null) {
            System.out.println("Connected!");
            return res.body();
        } else {
            System.out.println("Authentication failed!");
        }

        return null;
    }

    public Map<String, String> getRemoteBuilds() {
        Map<String, String> builds = new HashMap<>();

        HttpResponse<String> res = wait(get("/user/" + uuid.toString() + "/saves"));

        if (res.statusCode() != 200) {
            System.out.println("Unable to fetch builds.");
            return builds;
        }

        try {
            JsonArray buildsObjects = JsonParser.parseString(res.body()).getAsJsonArray();

            for (int i = 0; i < buildsObjects.size(); i++) {
                JsonObject build = buildsObjects.get(i).getAsJsonObject();
                JsonElement name = build.get("name");
                JsonElement buildFile = build.get("buildFile");
                JsonElement md5 = buildFile.isJsonObject() ? buildFile.getAsJsonObject().get("md5") : null;

                if (name.isJsonPrimitive() && md5 != null && md5.isJsonPrimitive())
                    builds.put(name.getAsString(), md5.getAsString());
            }
        } catch (Exception ignored) {}

        return builds;
    }

    public void updateBuilds(List<String> toUpdate) {
        for (String buildId : toUpdate) {
            HttpResponse<String> response = wait(get("/build/" + buildId));
            if (response.statusCode() != 200) {
                System.out.println("Failed to fetch build " + buildId);
                continue;
            }

            try {
                JsonObject object = JsonParser.parseString(response.body()).getAsJsonObject();
                String filename = object.get("buildFile").getAsJsonObject().get("filename").getAsString();

                downloadFile(filename, DataManager.getSchematicsBaseDirectory().toPath().resolve(filename));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static @Nullable HttpResponse<Path> downloadFile(String filename, Path output) {
        System.out.println("Downloading " + filename + " to " + output);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ENDPOINT + "/files/" + filename))
                .build();

        try {
            return client.sendAsync(request, HttpResponse.BodyHandlers.ofFile(output)).get();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return null;
    }

    public static HttpResponse<String> wait(CompletableFuture<HttpResponse<String>> response) {
        try {
            return response.get();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return null;
    }

    public static CompletableFuture<HttpResponse<String>> post(String uri, JsonObject body) {
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(ENDPOINT + uri))
                .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                .header("Content-Type", "application/json").build();

        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }

    public static CompletableFuture<HttpResponse<String>> get(String uri) {
        return get(uri, new HashMap<>());
    }

    public static CompletableFuture<HttpResponse<String>> get(String uri, Map<String, String> params) {
        StringBuilder paramsString = new StringBuilder();
        for (String key : params.keySet()) {
            paramsString.append(key)
                    .append("=")
                    .append(params.get(key))
                    .append("&");
        }
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(ENDPOINT + uri + "?" + paramsString)).build();
        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }

    public boolean isConnected() {
        return connected;
    }
}
