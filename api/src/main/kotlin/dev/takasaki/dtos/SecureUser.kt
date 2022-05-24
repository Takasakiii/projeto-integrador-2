package dev.takasaki.dtos

import dev.takasaki.database.UserType

data class SecureUser (
    val id: String,
    val name: String,
    val surname: String,
    val email: String,
    val phone: String?,
    val userType: UserType
)