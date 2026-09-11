package io.agentplm.api.health;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;

import org.junit.jupiter.api.Test;

class PlatformResourceTest {

    @Test
    void healthReportsUp() {
        Map<String, Object> body = new PlatformResource().health();
        assertEquals("UP", body.get("status"));
        assertEquals("plm-api", body.get("service"));
    }
}
