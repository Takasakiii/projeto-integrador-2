package dev.takasaki.dtos

import org.valiktor.functions.hasSize
import org.valiktor.functions.isNotNull
import org.valiktor.validate

data class InterestMessage(
    val item: String,
    val message: String,
): IValidable {
    override fun validateItems() {
        validate(this) {
            validate(InterestMessage::item).isNotNull().hasSize(min = 20, max = 32)
            validate(InterestMessage::message).isNotNull().hasSize(min = 1, max = 2000)
        }
    }
}
