package dev.takasaki.plugins

import dev.takasaki.controllers.authRouter
import dev.takasaki.exceptions.database.DuplicateRegisterException
import dev.takasaki.extensions.getValidationErrors
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import org.valiktor.ConstraintViolationException
import dev.takasaki.dtos.Error as ErrorDTO

fun Application.configureRouting() {
    install(StatusPages) {
        exception<DuplicateRegisterException> {call, cause ->
            call.respond(HttpStatusCode.Conflict,
                ErrorDTO(message = cause.message ?: "Duplicate register")
            )
        }
        exception<ConstraintViolationException> {call, cause ->
            call.respond(HttpStatusCode.UnprocessableEntity,
                ErrorDTO(message = cause.getValidationErrors())
            )
        }
        exception<Exception> {call, cause ->
            call.respond(HttpStatusCode.InternalServerError,
                ErrorDTO(message = cause.message ?: "Internal server error")
            )
        }
    
    }

    routing {
        authRouter()
    }
}
