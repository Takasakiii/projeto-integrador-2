package dev.takasaki.controllers

import dev.takasaki.database.Users
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.usersRoute() {
    route("/users") {
        authenticate(optional = true) {
            get("/{id}") {
                val id = call.parameters["id"]!!

                val principal = call.principal<JWTPrincipal>()
                val foundUser: Any = if(principal != null) {
                    Users.getRestricted(id)
                } else {
                    Users.get(id)
                }

                call.respond(foundUser)
            }
        }
    }
}