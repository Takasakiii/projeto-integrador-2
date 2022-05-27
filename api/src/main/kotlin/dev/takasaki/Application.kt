package dev.takasaki

import io.ktor.server.application.*
import dev.takasaki.plugins.*

fun main(args: Array<String>): Unit =
    io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // application.conf references the main function. This annotation prevents the IDE from marking it as unused.
fun Application.module() {
    configureDatabase()
    configureStorage()
    configureRouting()
    configureSerialization()
    configureHTTP()
    configureSecurity()
    configureWebsocket()
}
