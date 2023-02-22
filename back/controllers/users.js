const User = require("../mongo").User
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

// Créer un nouvel utilisateur
// Hash le password quand l'utilisateur le crée
// Sauvegarder l'utilisateur dans la BDD
async function createUser(req, res) {
try {
const { email, password } = req.body
const hashedPassword = await hashPassword(password)
const user = new User({ email, password: hashedPassword})
await user.save()
res.status(201).send({message: "User saved"})
} catch (err) {
res.status(409).send({message: "User not saved" + err})
}
}

// Hash 10 fois du password avec bcrypt
function hashPassword(password){
const saltRounds = 10
return bcrypt.hash(password, saltRounds)
}

// Login
// On vérifie si l'email utilisateur existe dans la BDD
async function logUser(req, res) {
try {
const email = req.body.email
const password = req.body.password
const user = await User.findOne({ email: email })

 // On compare les entrées et les données
const passwordOk = await bcrypt.compare(password, user.password)

// Si c'est différent
if (!passwordOk) {
res.status(403).send({ message: "Incorrect Password"})
}     
const token = createToken(email)
res.status(200).send({ userId: user?._id, token: token})
} catch (err) {
    console.error(err)
res.status(500).send({ message: "Error" })
}
}

function createToken(email){
const jwtPassword = process.env.JWT_PASSWORD
return jwt.sign({ email: email }, `${jwtPassword}`, {expiresIn: "24h"})
}


module.exports = { createUser, logUser }