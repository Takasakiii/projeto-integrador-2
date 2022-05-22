package dev.takasaki.plugins


import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database

fun Application.configureDatabase() {
    val envConfig = this@configureDatabase.environment.config

    val url = envConfig.property("database.url").getString()
    val username = envConfig.property("database.username").getString()
    val password = envConfig.property("database.password").getString()

    Database.connect(url, driver = "com.mysql.cj.jdbc.Driver", user = username, password = password)
}