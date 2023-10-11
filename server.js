const express = require('express')
const cors = require('cors')
const app = express()
const http = require("http") // necessary for socketIO
require("dotenv").config()
const { Server } = require("socket.io")
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONT_END,
        method: ["GET", "POST", "DELETE", "PUT"]
    }
})

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`)

    socket.on("join_room", (room) =>{
        socket.join(room)
        //setShowChat(true)
       // console.log(`User ID: ${socket.id} joined room: ${room} `)
    })

    socket.on("send_message", (message) => {
      //  console.log(message)
        socket.to(message.room).emit("receive_message",message) // sends back to front-end
         // message is shared between people within room
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })
})

app.use(cors())

server.listen(process.env.PORT, () => {
    console.log(`server is running in port ${process.env.PORT}`)
})
