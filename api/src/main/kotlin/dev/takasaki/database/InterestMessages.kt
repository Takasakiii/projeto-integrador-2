package dev.takasaki.database

import org.jetbrains.exposed.sql.Table

object InterestMessages: Table() {
    private val id = varchar("id", 32)
    private val item = reference("item", Items.id)
    private val userSend = reference("user_send", Users.id)
    private val userReceive = reference("user_receive", Users.id)
    private val message = text("message")
    private val read = bool("read").index()
}