package dev.takasaki.database

import com.toxicbakery.bcrypt.Bcrypt
import cool.graph.cuid.Cuid
import dev.takasaki.dtos.SecureUser
import dev.takasaki.dtos.User
import dev.takasaki.exceptions.database.DuplicateRegisterException
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLIntegrityConstraintViolationException
import java.util.*

object Users : Table() {
    val id = varchar("id", 32)
    val name = varchar("name", 50)
    val surname = varchar("surname", 256)
    val email = varchar("email", 256).uniqueIndex()
    val password = varchar("password", 256)
    val phone = varchar("phone", 11).nullable()
    val userType = enumeration<UserType>("user_type")

    override val primaryKey = PrimaryKey(id)

    fun register(user: User): SecureUser {
        try {
            val idGen = Cuid.createCuid()
            val passwordHashRaw = Bcrypt.hash(user.password, 10)
            val passwordHash = Base64.getEncoder().encodeToString(passwordHashRaw)

            transaction {
                Users.insert {
                    it[id] = idGen
                    it[name] = user.name
                    it[email] = user.email
                    it[password] = passwordHash
                    it[surname] = user.surname
                    it[phone] = user.phone
                    it[userType] = user.userType
                }
            }

            return SecureUser(idGen, user.name, user.surname, user.email, user.phone, user.userType)
        } catch (e: ExposedSQLException) {
            if (e.cause is SQLIntegrityConstraintViolationException) {
                throw DuplicateRegisterException("User with email ${user.email} already exists")
            }
            throw e
        }
    }
}

