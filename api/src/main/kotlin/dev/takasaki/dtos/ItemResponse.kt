package dev.takasaki.dtos

data class ItemResponse(
    val id: String,
    val name: String,
    val description: String,
    val amount: Int,
    val owner: String,
)
