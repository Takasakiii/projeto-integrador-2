package dev.takasaki.plugins

import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.takasaki.database.Users
import io.ktor.server.application.*

fun Application.configureSecurity() {
    
    authentication {
        jwt {
            val jwtAudience = this@configureSecurity.environment.config.property("jwt.audience").getString()
            realm = this@configureSecurity.environment.config.property("jwt.realm").getString()
            val secret = this@configureSecurity.environment.config.property("jwt.secret").getString()
            val issuer = this@configureSecurity.environment.config.property("jwt.domain").getString()
            verifier(
                JWT
                    .require(Algorithm.HMAC256(secret))
                    .withAudience(jwtAudience)
                    .withIssuer(issuer)
                    .build()
            )
            validate { credential ->
                if (credential.payload.audience.contains(jwtAudience)
                        && Users.hasUser(credential.payload.getClaim("id").asString()))
                    JWTPrincipal(credential.payload)
                else
                    null
            }
        }
    }
}
