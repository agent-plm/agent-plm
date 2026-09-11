package io.agentplm.api.season;

import java.util.List;
import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/seasons")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SeasonResource {

    @Inject
    SeasonService seasons;

    @GET
    public List<SeasonResponse> list() {
        return seasons.list();
    }

    @GET
    @Path("/{id}")
    public SeasonResponse get(@PathParam("id") UUID id) {
        return seasons.get(id);
    }

    @POST
    public Response create(@Valid SeasonRequest request) {
        SeasonResponse created = seasons.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public SeasonResponse update(@PathParam("id") UUID id, @Valid SeasonRequest request) {
        return seasons.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    public Response archive(@PathParam("id") UUID id) {
        seasons.archive(id);
        return Response.noContent().build();
    }
}
