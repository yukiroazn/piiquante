// Pour créer des applis web avec Node
const express = require('express')

// Je fais appel au module Express avec sa fonction
const app = express()
const cors = require('cors')

// Middleware
app.use(cors())
app.use(express.json())

module.exports = { app, express }