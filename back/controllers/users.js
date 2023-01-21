const User = require("../mongo").User
const bcrypt = require('bcrypt');

// Créer un nouvel utilisateur
async function createUser(req, res) {
const { email, password } = req.body

// Hash le password quand l'utilisateur le crée
const hashedPassword = await hashPassword(password)
const user = new User({ email, password: hashedPassword})

// Sauvegarder l'utilisateur dans la BDD
user
.save()
.then(() => res.status(201).send({ message: "User saved" }))
.catch((err) => res.status(409).send({ message: "User not saved" + err }));
}

// Hash 10 fois du password avec bcrypt
function hashPassword(password){
const saltRounds = 10
return bcrypt.hash(password, saltRounds)
}

// Login
async function logUser(req, res) {
const email = req.body.email
const password = req.body.password

// On vérifie si l'email utilisateur existe dans la BDD
const user = await User.findOne({ email: email })

// S'il n'existe pas
if (!user) {
return res.status(401).json({ error: "Erreur ! Utilisateur non trouvé !" });
}

// On compare les entrées et les données
const passwordOk = await bcrypt.compare(password, user.password)

// Si c'est différent
if (!passwordOk) {
res.status(403).send({ message: "Incorrect Password"})
}

// Si c'est correct
if (passwordOk) {
res.status(200).send({ message: "User Logged In"})
}
}

module.exports = { createUser, logUser }