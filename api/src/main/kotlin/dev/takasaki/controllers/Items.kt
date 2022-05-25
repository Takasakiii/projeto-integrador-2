package dev.takasaki.controllers

import dev.takasaki.database.Items
import dev.takasaki.dtos.Item
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.itemsRoute() {
    route("/items") {
        get {
            val page = try {
                call.request.queryParameters["page"]?.toUInt() ?: 0U
            } catch (e: NumberFormatException) {
                0U
            }

            val items = Items.list(page)

            call.respond(items)
        }

        authenticate {
            post {
                val itemData = call.receive<Item>()
                itemData.validateItems()

                val principal = call.principal<JWTPrincipal>()
                val userId = principal!!.payload.getClaim("id").asString()

                val itemResponse = Items.add(itemData, userId)

                call.respond(HttpStatusCode.Created, itemResponse)
            }
        }
    }
}