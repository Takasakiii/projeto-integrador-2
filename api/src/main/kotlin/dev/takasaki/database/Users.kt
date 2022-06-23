package dev.takasaki.database

import com.toxicbakery.bcrypt.Bcrypt
import cool.graph.cuid.Cuid
import dev.takasaki.dtos.Login
import dev.takasaki.dtos.PublicUser
import dev.takasaki.dtos.SecureUser
import dev.takasaki.dtos.User
import dev.takasaki.exceptions.UnauthorizedException
import dev.takasaki.exceptions.database.DuplicateRegisterException
import dev.takasaki.exceptions.database.NotFoundException
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.SQLIntegrityConstraintViolationException
import java.util.*
import kotlin.NoSuchElementException

object Users : Table() {
    val id = varchar("id", 32)
    private val name = varchar("name", 50)
    private val surname = varchar("surname", 256)
    private val email = varchar("email", 256).uniqueIndex()
    private val password = varchar("password", 256)
    private val phone = varchar("phone", 11).nullable()

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
                }
            }

            return SecureUser(idGen, user.name, user.surname, user.email, user.phone)
        } catch (e: ExposedSQLException) {
            if (e.cause is SQLIntegrityConstraintViolationException) {
                throw DuplicateRegisterException("User with email ${user.email} already exists")
            }
            throw e
        }
    }

    fun login(loginRequest: Login): SecureUser {
        try {
            val locatedUser = transaction {
                Users.select {
                    email eq loginRequest.email
                }.first()
            }

            val passwordHashRaw = Base64.getDecoder().decode(locatedUser[password])
            if(!Bcrypt.verify(loginRequest.password, passwordHashRaw)) {
                throw UnauthorizedException("Invalid credentials")
            }

            return SecureUser(
                locatedUser[id],
                locatedUser[name],
                locatedUser[surname],
                locatedUser[email],
                locatedUser[phone],
            )
        } catch (e: NoSuchElementException) {
            throw UnauthorizedException("Invalid credentials")
        }
    }

    fun hasUser(expectedId: String): Boolean {
        return transaction {
            Users.select {
                Users.id eq expectedId
            }.count() > 0
        }
    }

    fun get(id: String): PublicUser {
        return try {
            transaction {
                val foundUser = Users.select {
                    Users.id eq id
                }.first()

                PublicUser(
                    foundUser[Users.id],
                    foundUser[name],
                    foundUser[surname],
                )
            }
        } catch (e: NoSuchElementException) {
            throw NotFoundException("User with id $id not found")
        }
    }

    fun getRestricted(id: String): SecureUser {
        return try {
            transaction {
                val foundUser = Users.select {
                    Users.id eq id
                }.first()

                SecureUser(
                    foundUser[Users.id],
                    foundUser[name],
                    foundUser[surname],
                    foundUser[email],
                    foundUser[phone]
                )
            }
        } catch (e: NoSuchElementException) {
            throw NotFoundException("User with id $id not found")
        }
    }
}

