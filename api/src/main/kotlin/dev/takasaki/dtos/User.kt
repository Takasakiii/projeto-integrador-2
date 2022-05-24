package dev.takasaki.dtos

import dev.takasaki.database.UserType
import org.valiktor.functions.*
import org.valiktor.validate

data class User(
    val name: String,
    val surname: String,
    val email: String,
    val password: String,
    val phone: String?,
    val userType: UserType
) : IValidable {
    override fun validateItems() {
        validate(this) {
            validate(User::name).hasSize(min = 3, max = 50).isNotNull()
            validate(User::surname).hasSize(min = 3, max = 255).isNotNull()
            validate(User::email).isNotBlank().isEmail().isNotNull()
            validate(User::password).hasSize(min = 8).isNotNull()
            validate(User::phone).hasSize(min = 11, max = 11)
            validate(User::userType).isIn(UserType.values().asIterable()).isNotNull()
        }
    }
}
