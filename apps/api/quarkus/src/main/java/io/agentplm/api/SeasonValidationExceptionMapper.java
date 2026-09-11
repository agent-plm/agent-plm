package io.agentplm.api;

import java.util.Map;

import io.agentplm.modules.season.SeasonValidationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class SeasonValidationExceptionMapper implements ExceptionMapper<SeasonValidationException> {

    @Override
    public Response toResponse(SeasonValidationException exception) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", exception.getMessage()))
                .build();
    }
}
