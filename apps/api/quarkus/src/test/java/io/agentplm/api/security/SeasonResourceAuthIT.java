package io.agentplm.api.security;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import org.junit.jupiter.api.Test;

@QuarkusTest
@TestProfile(AuthEnforcementTestProfile.class)
class SeasonResourceAuthIT {

    @Test
    void healthRemainsPublic() {
        given()
                .when()
                .get("/api/health")
                .then()
                .statusCode(200)
                .body("status", equalTo("UP"));
    }

    @Test
    void seasonsRequiresAuthentication() {
        given()
                .when()
                .get("/api/seasons")
                .then()
                .statusCode(401)
                .body("error", equalTo("Authentication required"));
    }
}
