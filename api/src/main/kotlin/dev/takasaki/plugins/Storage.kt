package dev.takasaki.plugins

import cool.graph.cuid.Cuid
import dev.takasaki.exceptions.FileNotFoundException
import dev.takasaki.exceptions.UnsupportedImageException
import io.ktor.http.content.*
import java.io.File

const val STORAGE_PATH = "upload"

fun configureStorage() {
    val storage = File(STORAGE_PATH)

    if(!storage.isDirectory) {
        storage.mkdir()
    }
}

class Storage(collection: String) {
    private val collectionPath: String

    init {
        collectionPath = "$STORAGE_PATH/$collection"
        val collectionStorage = File(collectionPath)

        if(!collectionStorage.isDirectory) {
            collectionStorage.mkdir()
        }
    }

    fun addItem(file: PartData.FileItem): String {
        val extension = file.contentType?.contentSubtype  ?: throw UnsupportedImageException("Unsupported image type")

        val supportedExtensions = listOf("jpg", "jpeg", "png", "gif")

        if (!supportedExtensions.contains(extension)) {
            throw UnsupportedImageException("Unsupported image type")
        }

        val fileName = "${Cuid.createCuid()}.$extension"
        val finalPath = "$collectionPath/$fileName"

        val fileToSave = File(finalPath)
        file.streamProvider().use { inputStream ->
            fileToSave.outputStream().use { outputStream ->
                inputStream.copyTo(outputStream)
            }
        }

        return fileName
    }

    fun list(): List<String> {
        return File(collectionPath).listFiles()?.map { it.name } ?: emptyList()
    }

    fun get(fileName: String): File {
        val file = File("$collectionPath/$fileName")
        if(!file.exists()) throw FileNotFoundException("File not found")
        return file
    }

    fun removeStore() {
        File(collectionPath).deleteRecursively()
    }

    fun removeItem(filename: String) {
        val file = File("$collectionPath/$filename")
        file.delete()
    }
}