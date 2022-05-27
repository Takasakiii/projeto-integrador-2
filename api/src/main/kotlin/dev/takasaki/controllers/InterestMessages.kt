package dev.takasaki.controllers

import dev.takasaki.database.InterestMessages
import dev.takasaki.dtos.InterestMessage
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.interestMessagesRoute() {
    route("/messages") {
        authenticate {
            post {
                val message = call.receive<InterestMessage>()
                message.validateItems()

                val principal = call.principal<JWTPrincipal>()
                val userId = principal!!.payload.getClaim("id").asString()

                val response = InterestMessages.create(message, userId)

                call.respond(HttpStatusCode.Created, response)
            }

            get {
                val page = call.request.queryParameters["page"]?.toUInt() ?: 0U
                val item = call.request.queryParameters["item"]
                val read = call.request.queryParameters["read"]?.toBoolean() ?: false

                val principal = call.principal<JWTPrincipal>()
                val userId = principal!!.payload.getClaim("id").asString()

                val response = InterestMessages.list(userId, item, read, page)

                call.respond(response)
            }
        }
    }
}