package dev.takasaki.dtos

import org.valiktor.functions.isNotBlank
import org.valiktor.functions.isNotNull
import org.valiktor.validate

data class Login(
    val email: String,
    val password: String
): IValidable {
    override fun validateItems() {
        validate(this) {
            validate(Login::email).isNotNull().isNotBlank()
            validate(Login::password).isNotNull().isNotBlank()
        }
    }
}

