package dev.takasaki.dtos

data class InterestMessagesResponse(
    val id: String,
    val item: String,
    val userSend: String,
    val userReceive: String,
    val message: String,
    val createdAt: Long,
    val read: Boolean = false
)
