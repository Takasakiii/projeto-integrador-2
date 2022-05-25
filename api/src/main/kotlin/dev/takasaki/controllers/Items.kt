package dev.takasaki.controllers

import dev.takasaki.database.Items
import dev.takasaki.dtos.ImageCollection
import dev.takasaki.dtos.Item
import dev.takasaki.plugins.Storage
import io.ktor.http.*
import io.ktor.http.content.*
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

        route("/{idItem}") {
            imagesRoute()
        }
    }
}

fun Route.imagesRoute() {
    route("/images") {
        get {
            val idItem = call.parameters["idItem"]!!
            if (!Items.hasItem(idItem)) {
                call.respond(HttpStatusCode.NotFound)
                return@get
            }

            val images = Storage(idItem).list()
            call.respond(ImageCollection(idItem, images))
        }

        get("/{idImage}") {
            val idItem = call.parameters["idItem"]!!
            val idImage = call.parameters["idImage"]!!

            if (!Items.hasItem(idItem)) {
                call.respond(HttpStatusCode.NotFound)
                return@get
            }

            val image = Storage(idItem).get(idImage)
            call.respondFile(image)
        }

        authenticate {
            post {
                val idItem = call.parameters["idItem"]!!
                val multiFormData = call.receiveMultipart()

                val principal = call.principal<JWTPrincipal>()
                val userId = principal!!.payload.getClaim("id").asString()

                if (!Items.hasItem(userId, idItem)) {
                    call.respond(HttpStatusCode.NotFound)
                    return@post
                }

                val images = mutableListOf<String>()
                multiFormData.forEachPart { part ->
                    if(part is PartData.FileItem) {
                        val imageName = Storage(idItem).addItem(part)
                        images.add(imageName)
                    }
                }

                call.respond(HttpStatusCode.Created, ImageCollection(idItem, images))
            }
        }
    }
}