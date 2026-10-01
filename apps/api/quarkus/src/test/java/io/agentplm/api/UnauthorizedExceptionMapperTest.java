package io.agentplm.api;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.quarkus.security.UnauthorizedException;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

class UnauthorizedExceptionMapperTest {

    @Test
    void mapsBlankMessageToDefault() {
        UnauthorizedExceptionMapper mapper = new UnauthorizedExceptionMapper();
        Response response = mapper.toResponse(new UnauthorizedException());
        assertEquals(401, response.getStatus());
        assertEquals("Authentication required", ((java.util.Map<?, ?>) response.getEntity()).get("error"));
    }
}
