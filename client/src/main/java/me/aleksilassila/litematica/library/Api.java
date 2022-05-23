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

        System.out.println("Authenticating to API...");
        HttpResponse<String> res = wait(post("/login/token", object));

        if (res != null && res.statusCode() == 200) {
            System.out.println("Authenticated!");
            return res.body();
        } else {
            System.out.println("Authentication failed! Response body: " + (res != null ? res.body() : "null"));
        }

        return null;
    }

    public Map<Integer, LitematicFile> getRemoteBuilds() {
        Map<Integer, LitematicFile> builds = new HashMap<>();

        HttpResponse<String> res = wait(get("/sync/fetch", new HashMap<>(){{put("token", token);}}));

        if (res == null || res.statusCode() != 200) {
            System.out.println("Unable to fetch builds.");
            return builds;
        }

        try {
            JsonArray buildsObjects = JsonParser.parseString(res.body()).getAsJsonArray();

            for (int i = 0; i < buildsObjects.size(); i++) {
                JsonObject build = buildsObjects.get(i).getAsJsonObject();
                int id = build.get("id").getAsInt();
                String md5 =  build.get("md5").getAsString();
                String name = build.get("name").getAsString();
                String url =  build.get("url").getAsString();
                String updatedAt =  build.get("updatedAt").getAsString();

                builds.put(id, new LitematicFile(id, name + ".litematic", md5));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return builds;
    }

    public void fetchBuilds(List<LitematicFile> toUpdate) {
        for (LitematicFile file : toUpdate) {
            HttpResponse<Path> response = downloadFile(file.id, file.file);

            if (response != null && response.statusCode() == 200) {
                System.out.println("Downloaded file " + file.filename);
            } else {
                System.out.println("Failed to download file " + file.filename);
            }
        }
    }

    public static @Nullable HttpResponse<Path> downloadFile(int buildId, Path output) {
        System.out.println("Downloading " + buildId + " to " + output);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ENDPOINT + "/files/id/" + buildId))
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
