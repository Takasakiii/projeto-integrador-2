package dev.takasaki.database

import cool.graph.cuid.Cuid
import dev.takasaki.dtos.Item
import dev.takasaki.dtos.ItemResponse
import dev.takasaki.exceptions.database.NotFoundException
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import kotlin.math.ceil

object Items: Table() {
    val id = varchar("id", 32)
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

    fun list(page: UInt): Pair<Int, List<ItemResponse>> {
        return transaction {
            val items = Items.selectAll().limit(10, (page * 10U).toLong())

            val itemsFormatted = items.map {
                ItemResponse(it[Items.id], it[name], it[description], it[amount], it[owner])
            }

            val qtdPages = Items.selectAll().count() / 10.0

            Pair(ceil(qtdPages).toInt(), itemsFormatted)
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

    fun get(itemId: String): ItemResponse {
        try {
            return transaction {
                val item = Items.select {
                    Items.id eq itemId
                }.first()

                ItemResponse(item[Items.id], item[name], item[description], item[amount], item[owner])
            }
        } catch (e: NoSuchElementException) {
            throw NotFoundException("$itemId not found")
        }
    }
}