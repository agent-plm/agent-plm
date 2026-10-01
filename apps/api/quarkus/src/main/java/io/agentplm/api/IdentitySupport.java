package io.agentplm.api;

import java.util.Map;
import java.util.Optional;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;

@ApplicationScoped
public class IdentitySupport {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    Instance<JsonWebToken> jwt;

    public Optional<String> username() {
        if (securityIdentity == null || securityIdentity.isAnonymous()) {
            return Optional.empty();
        }
        String preferred = jwt.isResolvable() ? jwt.get().getClaim("preferred_username") : null;
        if (preferred != null && !preferred.isBlank()) {
            return Optional.of(preferred);
        }
        String principal = securityIdentity.getPrincipal() == null ? null : securityIdentity.getPrincipal().getName();
        if (principal != null && !principal.isBlank()) {
            return Optional.of(principal);
        }
        return Optional.empty();
    }

    public Map<String, Object> snapshot() {
        return username()
                .map(name -> Map.<String, Object>of("username", name))
                .orElseGet(Map::of);
    }
}
