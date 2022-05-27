package dev.takasaki.plugins

import io.ktor.serialization.gson.*
import io.ktor.server.application.*
import io.ktor.server.websocket.*

fun Application.configureWebsocket() {
    install(WebSockets) {
        contentConverter = GsonWebsocketContentConverter()
    }
}