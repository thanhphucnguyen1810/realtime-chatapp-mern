/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import app from '~/app'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { corsOptions } from './config/cors'

import socketIo from 'socket.io'
import http from 'http'
import User from './models/user.model'
import FriendRequest from './models/friendRequest.model'
import path from 'path'

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

let server = null
const START_SERVER = () => {
  const HOSTNAME = process.env.APP_HOST
  const PORT = process.env.APP_PORT

  server = http.createServer(app)
  const io = socketIo(server, { cors: corsOptions })

  server.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`)
  })

  io.on('connection', async (socket) => {
    // Gọi các socket tùy theo tính năng
    // console.log(JSON.stringify(socket.handshake.query))

    const user_id = socket.handshake.query['user_id']
    const socket_id = socket.id
    console.log(`User connected ${socket._id}`)
    if (Boolean(user_id)) {
      await User.findByIdAndUpdate(user_id, { socket_id, status: 'Online' })
    }

    //we can write our socket event listeners here
    socket.on('friend_ request', async (data, callback) => {
      console.log(data.to)

      const to_user = await User.findById(data.to).select('socket_id')
      const from_user = await User.findById(data.from).select('socket_id')

      await FriendRequest.create({
        sender: data.from,
        recipient: data.to
      })

      // TODO: Create a friend request
      // emit event => 'new_friend_request'
      io.to(to_user.socket_id).emit('new_friend_request', {
        //
        message: 'New Friend Request Received'
      })
      // emit event => 'request_sent'
      io.to(from_user.socket_id).emit('request_sent', {
        message: 'Request sent successfully!'
      })
    })

    socket.on('accept_request', async ( data ) => {
      console.log(data)
      const request_doc = await FriendRequest.findById(data.request_id)
      console.log(request_doc)

      // request_id

      const sender = await User.findById(request_doc.sender)
      const receiver = await User.findById(request_doc.recipient)

      sender.friends.push(request_doc.recipient)
      sender.friends.push(request_doc.sender)

      await receiver.save({ new: true, validateModifiedOnly: true })
      await sender.save({ new: true, validateModifiedOnly: true })

      await FriendRequest.findByIdAndDelete(data.request_id)

      io.to(sender.socket_id).emit('request_accepted', {
        message: 'Friend Request Accepted!'
      })
      io.to(receiver.socket_id).emit('request_accepted', {
        message: 'Friend Request Accepted!'
      })
    })

    // Handle text/link messages
    socket.on('text_message', (data) => {
      console.log('Received Message', data)

      // data: { to, from, text}
      // Create a new conversation if it doesn't exist yet or add new message

      // save to db

      // emit incoming_message -> to user

      // emit outgoing_message -> from user


    })

    socket.on('file_message', (data) => {
      console.log('Received Message', data)
      // data: { to, from, text, file }

      // get the file extension
      const fileExtension = path.extname(data.file.name)

      // generate a unique filename
      const fileName = `${Date.now()}_${Math.floor(Math.random()*10000)}${fileExtension}`

      // upload file to AWS s3

      // Create a new conversation if it doesn't exist yet or add new message

      // save to db

      // emit incoming_message -> to user

      // emit outgoing_message -> from user

    })
    socket.on('end', async (data) => {
      // Find user by _id set the status to offline
      if (data.user_id) {
        await User.findByIdAndUpdate(data.user_id, { status: 'Offline' })
      }

      // TODO: broadcast user_disconnected

      console.log('Closing connection')
      socket.disconnect(0)

    })

  })

  exitHook(() => {
    console.log('4. Closing MongoDB connection...')
    CLOSE_DB()
    console.log('5. MongoDB connection closed.')
  })
}

// Connect DB  and start server
(async () => {
  try {
    console.log('1. Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB.')
    START_SERVER()
  } catch (error) {
    console.error('2.1 Failed to connect DB:', error)
    process.exit(1)
  }
})()

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  if (server) {
    server.close(() => process.exit(1))
  } else {
    process.exit(1)
  }
})
