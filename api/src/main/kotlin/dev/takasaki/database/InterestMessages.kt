package dev.takasaki.database

import cool.graph.cuid.Cuid
import dev.takasaki.dtos.InterestMessage
import dev.takasaki.dtos.InterestMessagesResponse
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

object InterestMessages: Table() {
    private val id = varchar("id", 32)
    private val item = reference("item", Items.id).index()
    private val userSend = reference("user_send", Users.id).index()
    private val userReceive = reference("user_receive", Users.id).index()
    private val message = text("message")
    private val createdAt = long("created_at")
    private val read = bool("read").index().default(false)

    override val primaryKey = PrimaryKey(id)

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

    fun list(
        ownerId: String,
        itemQuery: String?,
        readQuery: Boolean = false,
        page: UInt = 0U
    ): List<InterestMessagesResponse> {
        return transaction {
            val locatedMessages = if (itemQuery == null) {
                InterestMessages.select {
                     userReceive eq ownerId and (read eq readQuery)
                }
            } else {
                InterestMessages.select{
                    item eq itemQuery and (userReceive eq ownerId or (userSend eq ownerId)) and (read eq readQuery)
                }
            }.limit(10, (page * 10U).toLong())

            locatedMessages.map {
                InterestMessagesResponse(
                    it[InterestMessages.id],
                    it[item],
                    it[userSend],
                    it[userReceive],
                    it[message],
                    it[createdAt],
                    it[read]
                )
            }
        }
    }
}