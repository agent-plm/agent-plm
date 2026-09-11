package io.agentplm.api;

import java.util.Map;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class ConflictExceptionMapper implements ExceptionMapper<ConflictException> {

    @Override
    public Response toResponse(ConflictException exception) {
        return Response.status(Response.Status.CONFLICT)
                .entity(Map.of("error", exception.getMessage()))
                .build();
    }
}
