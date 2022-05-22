package dev.takasaki.plugins


import dev.takasaki.database.Users
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

fun Application.configureDatabase() {
    val envConfig = this@configureDatabase.environment.config

    val url = envConfig.property("database.url").getString()
    val username = envConfig.property("database.username").getString()
    val password = envConfig.property("database.password").getString()

    Database.connect(url, driver = "com.mysql.cj.jdbc.Driver", user = username, password = password)

    transaction {
        SchemaUtils.create(Users)
    }
}