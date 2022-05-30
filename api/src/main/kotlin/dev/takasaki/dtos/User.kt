package dev.takasaki.dtos

import org.valiktor.functions.*
import org.valiktor.validate

data class User(
    val name: String,
    val surname: String,
    val email: String,
    val password: String,
    val phone: String?,
) : IValidable {
    override fun validateItems() {
        validate(this) {
            validate(User::name).hasSize(min = 3, max = 50).isNotNull()
            validate(User::surname).hasSize(min = 3, max = 255).isNotNull()
            validate(User::email).isNotBlank().isEmail().isNotNull()
            validate(User::password).hasSize(min = 8).isNotNull()
            validate(User::phone).hasSize(min = 10, max = 11)
        }
    }
}
