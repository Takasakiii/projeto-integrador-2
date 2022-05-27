package dev.takasaki.controllers

import dev.takasaki.database.InterestMessages
import dev.takasaki.dtos.InterestMessage
import dev.takasaki.extensions.ConnectionsPool
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*

fun Route.interestMessagesRoute() {
    val connections = ConnectionsPool()

    route("/messages") {
        authenticate {
            post {
                val message = call.receive<InterestMessage>()
                message.validateItems()

                val principal = call.principal<JWTPrincipal>()
                val userId = principal!!.payload.getClaim("id").asString()

                val response = InterestMessages.create(message, userId)

                connections.sendTo(response.userReceive, response)
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

            webSocket("/subscribe") {
                val principal = call.principal<JWTPrincipal>()
                val userId = principal!!.payload.getClaim("id").asString()

                connections.add(this, userId)
                sendSerialized(mapOf("type" to "subscribe", "userId" to userId))
            }
        }
    }
}

