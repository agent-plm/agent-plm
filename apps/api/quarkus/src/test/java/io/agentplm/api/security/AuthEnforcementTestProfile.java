package io.agentplm.api.security;

import java.util.Map;

import io.quarkus.test.junit.QuarkusTestProfile;

public class AuthEnforcementTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Map.of(
                "quarkus.oidc.enabled", "false",
                "quarkus.http.auth.proactive", "true",
                "quarkus.http.auth.permission.public.paths", "/api/health,/api/info",
                "quarkus.http.auth.permission.public.policy", "permit",
                "quarkus.http.auth.permission.authenticated.paths", "/api/seasons,/api/seasons/*",
                "quarkus.http.auth.permission.authenticated.policy", "authenticated");
    }
}
