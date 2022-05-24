package dev.takasaki.dtos

data class Error <T>(val type: String = "error", val message: T)