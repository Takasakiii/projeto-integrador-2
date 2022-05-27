package dev.takasaki.extensions

import io.ktor.server.websocket.*
import kotlinx.coroutines.*
import java.util.Collections

class Connection(private val session: WebSocketServerSession, val id: String) {
    fun send(message: Any) {
        runBlocking {
            launch(Dispatchers.Default) {
                session.sendSerialized(message)
            }
        }
    }
}

class ConnectionsPool {
    private val connections = Collections.synchronizedSet<Connection?>(HashSet())

    fun add(session: WebSocketServerSession, id: String) {
        connections += Connection(session, id)
    }


//    fun broadcast(message: Any) {
//        connections.forEach {
//            it.send(message)
//        }
//    }

    fun sendTo(id: String, message: Any) {
        connections.forEach {
            if (it?.id == id) {
                it.send(message)
            }
        }
    }

}