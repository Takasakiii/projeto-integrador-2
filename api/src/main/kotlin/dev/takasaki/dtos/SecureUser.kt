package dev.takasaki.dtos


data class SecureUser (
    val id: String,
    val name: String,
    val surname: String,
    val email: String,
    val phone: String?,
)