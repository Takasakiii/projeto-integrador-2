package dev.takasaki.extensions

import org.valiktor.ConstraintViolationException
import org.valiktor.i18n.ConstraintViolationMessage
import org.valiktor.i18n.mapToMessage
import java.util.*

fun ConstraintViolationException.getValidationErrors(): List<ConstraintViolationMessage> =
    this.constraintViolations.mapToMessage(locale = Locale.ENGLISH)