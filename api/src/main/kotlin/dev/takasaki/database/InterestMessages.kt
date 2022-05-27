package dev.takasaki.database

import cool.graph.cuid.Cuid
import dev.takasaki.dtos.InterestMessage
import dev.takasaki.dtos.InterestMessagesResponse
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction

object InterestMessages: Table() {
    private val id = varchar("id", 32)
    private val item = reference("item", Items.id).index()
    private val userSend = reference("user_send", Users.id).index()
    private val userReceive = reference("user_receive", Users.id).index()
    private val message = text("message")
    private val createdAt = long("created_at")
    private val read = bool("read").index().default(false)

    fun create(message: InterestMessage, messageAuthor: String): InterestMessagesResponse {
        val idGen = Cuid.createCuid()
        val now = System.currentTimeMillis()

        val item = transaction {
            val locatedItem = Items.get(message.item)

            InterestMessages.insert {
                it[id] = idGen
                it[item] = locatedItem.id
                it[userSend] = messageAuthor
                it[userReceive] = locatedItem.owner
                it[this.message] = message.message
                it[createdAt] = now
            }

            locatedItem
        }

        return InterestMessagesResponse(
            idGen,
            item.id,
            messageAuthor,
            item.owner,
            message.message,
            now,
        )
    }
}