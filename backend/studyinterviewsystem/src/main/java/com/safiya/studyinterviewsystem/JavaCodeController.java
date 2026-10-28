
package com.safiya.studyinterviewsystem;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/java-code")
public class JavaCodeController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @PostMapping("/run")
    public Map<String, String> runCode(
            @RequestBody Map<String, String> request) {

        Map<String, String> result = new HashMap<>();

        try {
            String apiKey = System.getenv("ONLINECOMPILER_API_KEY");
            String code = request.get("code");

            if (apiKey == null || apiKey.isBlank()) {
                result.put("error", "API key is missing. Restart the backend with the API key set.");
                return result;
            }

            if (code == null || code.isBlank()) {
                result.put("error", "Please enter your Java code.");
                return result;
            }

            if (code.length() > 100_000) {
                result.put("error", "Code is too long. Maximum size is 100 KB.");
                return result;
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("compiler", "openjdk-25");
            payload.put("code", code);
            payload.put("time_limit", 10);

            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(
                        "https://api.onlinecompiler.io/api/run-code-sync/"))
                    .timeout(Duration.ofSeconds(35))
                    .header("Authorization", apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    httpRequest,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {
                result.put("error",
                        "OnlineCompiler request failed (HTTP "
                        + response.statusCode() + "). Check your API key and account.");
                return result;
            }

            Map<?, ?> compilerResult = objectMapper.readValue(
                    response.body(), Map.class);

            Object outputValue = compilerResult.get("output");
String output = outputValue == null ? "" : outputValue.toString();

Object errorValue = compilerResult.get("error");
String error = errorValue == null ? "" : errorValue.toString();

            if (!error.isBlank()) {
                result.put("error", error);
            }

            result.put("output",
                    output.isBlank() && !error.isBlank()
                    ? error
                    : output.isBlank() ? "Program executed with no output." : output);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            result.put("error", "Code execution was interrupted.");

        } catch (Exception e) {
            result.put("error",
                    "Could not execute the code. Check the backend connection and try again.");
        }

        return result;
    }
}
