require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

// Important for connecting to Database
require("./mongo")

// Importation controllers for creating new users
const {createUser, logUser} = require("./controllers/users")

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/", (req, res) => res.send("hot takes"))

// Listen
app.listen(port, () => console.log('listening on port' + port))