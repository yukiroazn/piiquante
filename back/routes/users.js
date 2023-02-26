const express = require('express') // J'importe les npms nécessaires
const users = express.Router() // La fonction Router d'express permet de créer des routes individuelles pour créer des objets router
const { createUser, logUser } = require("../controllers/users") // J'importe les autres dépendances nécessaires

// Je configure les routes pour créer un compte et se connecter au compte
users.post("/signup", createUser)
users.post("/login", logUser)

module.exports = { users }