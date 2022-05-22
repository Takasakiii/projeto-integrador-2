package dev.takasaki.controllers

import io.ktor.server.routing.*

fun Route.authRouter() {
    route("/auth") {
        post("/register") {

        }
    }
}