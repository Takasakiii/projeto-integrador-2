package dev.takasaki.database

import org.jetbrains.exposed.sql.Table

object Images: Table() {
    val id = varchar("id", 32)
    val image = blob("image")
    val itemId = reference("item_id", Items.id)

    override val primaryKey = PrimaryKey(id)
}