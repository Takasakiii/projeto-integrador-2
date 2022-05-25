package dev.takasaki.database

import cool.graph.cuid.Cuid
import dev.takasaki.dtos.Item
import dev.takasaki.dtos.ItemResponse
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

object Items: Table() {
    private val id = varchar("id", 32)
    private val name = varchar("name", 256)
    private val description = text("description")
    private val amount = integer("amount")
    private val owner = reference("owner", Users.id)

    override val primaryKey = PrimaryKey(id)

    fun add(item: Item, userId: String): ItemResponse {
        val idGen = Cuid.createCuid()

        transaction {
            Items.insert {
                it[id] = idGen
                it[name] = item.name
                it[description] = item.description
                it[amount] = item.amount
                it[owner] = userId
            }
        }

        return ItemResponse(idGen, item.name, item.description, item.amount, userId)
    }

    fun list(page: UInt): List<ItemResponse> {
        return transaction {
            val items = Items.selectAll().limit(10, (page * 10U).toLong())

            items.map {
                ItemResponse(it[Items.id], it[name], it[description], it[amount], it[owner])
            }
        }
    }

    fun hasItem(userId: String, itemId: String): Boolean {
        return transaction {
            Items.select {
                Items.id eq itemId and (owner eq userId)
            }.count() > 0
        }
    }

    fun hasItem(itemId: String): Boolean {
        return transaction {
            Items.select {
                Items.id eq itemId
            }.count() > 0
        }
    }
}