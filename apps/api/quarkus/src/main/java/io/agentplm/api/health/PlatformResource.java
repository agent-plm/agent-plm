package io.agentplm.api.health;

import java.util.Map;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
public class PlatformResource {

    @GET
    @Path("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "plm-api",
                "phase", "1-skeleton");
    }

    @GET
    @Path("/info")
    public Map<String, Object> info() {
        return Map.of(
                "name", "Agent PLM",
                "version", "0.1.0-SNAPSHOT",
                "phase", "Platform skeleton");
    }
}
