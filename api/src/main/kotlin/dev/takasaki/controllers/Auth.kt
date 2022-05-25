package dev.takasaki.controllers

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.takasaki.database.Users
import dev.takasaki.dtos.Login
import dev.takasaki.dtos.Token
import dev.takasaki.dtos.User
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.*

fun Route.authRouter() {
    route("/auth") {
        post("/register") {
            val user = call.receive<User>()
            user.validateItems()
            val registeredUser = Users.register(user)
            call.respond(HttpStatusCode.Created, registeredUser)
        }
        post("/login") {
            val loginData = call.receive<Login>()
            loginData.validateItems()
            val userData = Users.login(loginData)

            val config = this@authRouter.environment?.config ?: throw java.lang.Exception("Environment config is null")

            val secret = config.property("jwt.secret").getString()
            val issuer = config.property("jwt.domain").getString()
            val audience = config.property("jwt.audience").getString()

            val token = JWT.create()
                .withAudience(audience)
                .withIssuer(issuer)
                .withClaim("id", userData.id)
                .withExpiresAt(Date(System.currentTimeMillis() + 604800000))
                .sign(Algorithm.HMAC256(secret))

            val tokenResponse = Token(userData, token)

            call.respond(HttpStatusCode.OK, tokenResponse)
        }
    }
}