// Pour faciliter les interactions avec la BDD MongoDB
const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator") // Pour réfuser de créer un compte avec le même email

const password = process.env.DB_PASS
const username = process.env.DB_USER
const dataBase = process.env.DB_DATA
const uri = `mongodb+srv://${username}:${password}@cluster0.r4h8ox5.mongodb.net/${dataBase}?retryWrites=true&w=majority`

// Set the `strictQuery` option to `false`
mongoose.set('strictQuery', false);

// Je me connecte à la BDD
mongoose
.connect(uri)
.then(() => console.log('Connected to MongoDb !'))
.catch(() => console.log('Connection Lost !'));

// J'importe le modèle schema pour l'email(unique) et le mot de passe
const userSchema = new mongoose.Schema({
email: {type: String, required: true, unique: true},
password: {type: String, required: true}
})
userSchema.plugin(uniqueValidator) // Vérifié par cette dépendance

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}
