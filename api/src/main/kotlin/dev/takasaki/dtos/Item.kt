package dev.takasaki.dtos

import org.valiktor.functions.hasSize
import org.valiktor.functions.isBetween
import org.valiktor.functions.isNotNull
import org.valiktor.validate

data class Item(
    val name: String,
    val description: String,
    val amount: Int,
) : IValidable {
    override fun validateItems() {
        validate(this) {
            validate(Item::name).hasSize(min = 3, max = 256).isNotNull()
            validate(Item::description).hasSize(min = 3, max = 2048).isNotNull()
            validate(Item::amount).isBetween(start = 1, end = 1000)
        }
    }

}