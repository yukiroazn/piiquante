// Pour faciliter les inéractions avec la bdd mongoDB
const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

const password = process.env.DB_PASS
const username = process.env.DB_USER
const dataBase = process.env.DB_DATA
const uri = `mongodb+srv://${username}:${password}@cluster0.r4h8ox5.mongodb.net/${dataBase}?retryWrites=true&w=majority`

// Je me connecte à la BDD
mongoose
.connect(uri)
.then(() => console.log('Connected to MongoDb !'))
.catch(() => console.log('Connection Lost !'));

// J'importe le schema de password
const userSchema = new mongoose.Schema({
email: {type: String, required: true, unique: true},
password: {type: String, required: true}
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}
