package dev.takasaki.database

import org.jetbrains.exposed.sql.Table

object Users : Table() {
    val id = varchar("id", 32)
    val name = varchar("name", 50)
    val surname = varchar("surname", 256)
    val email = varchar("email", 256).uniqueIndex()
    val password = varchar("password", 256)
    val phone = varchar("phone", 11).nullable()
    val userType = enumeration<UserType>("user_type")

    override val primaryKey = PrimaryKey(id)
}

