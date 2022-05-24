package dev.takasaki.controllers

import dev.takasaki.database.Users
import dev.takasaki.dtos.User
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.authRouter() {
    route("/auth") {
        post("/register") {
            val user = call.receive<User>()
            user.validateItems()
            val registeredUser = Users.register(user)
            call.respond(HttpStatusCode.Created, registeredUser)
        }
    }
}