package dev.takasaki.database

import org.jetbrains.exposed.sql.Table

object Items: Table() {
    val id = varchar("id", 32)
    val name = varchar("name", 256)
    val description = text("description")
    val amount = integer("amount")

    override val primaryKey = PrimaryKey(id)
}