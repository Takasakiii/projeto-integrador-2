package dev.takasaki.controllers

import dev.takasaki.database.Users
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.usersRoute() {
    route("/users") {
        get("/{id}") {
            val id = call.parameters["id"]!!

            val foundUser = Users.get(id)
            call.respond(foundUser)
        }
    }
}