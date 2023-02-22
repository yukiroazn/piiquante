const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
userId : String,
name : String,
manufacturer : String,
description : String,
mainPepper : String,
imageUrl : String,
heat : Number,
likes : Number,
dislikes : Number,
usersLiked : [String],
usersDisliked : [String],
})

const Product = mongoose.model("Product", productSchema)

// Middleware
function authenticateUser(req, res) { 
const header = req.header("Authorization")
if (header == null) return res.status(403).send({ message: "Invalid" }) 

const token = header.split(" ")[1]
if (token == null) return res.status(403).send({ message: "Token cannot be null" })

jwt.verify(token, process.env.JWT_PASSWORD), (err, decoded) => getSauces(err, decoded, res)
Product.find({}).then(products => res.send(products)).catch(error => res.stats(500).send(error))
}

function getSauces(err, res) {
if (err) res.status(403).send({message: "Token invalid" + err})
} 

// Modify Sauce
function getSauceById(req, res) {
const { id } = req.params
Product.findById(id)
.then(product => res.send(product))
.catch(console.error)
}

// Create Sauce
function createSauce(req, res) {
const { body, file } = req
const { filename } = file
const sauce = JSON.parse(body.sauce)
const { name,manufacturer, description, mainPepper, heat, userId } = sauce

function makeImageUrl(req, filename) {
return req.protocol + "://" + req.get("host") + "/images/" + filename
}

const product = new Product({
userId: userId,
name: name,
manufacturer: manufacturer,
description: description,
mainPepper: mainPepper,
imageUrl: makeImageUrl(req, filename),
heat: heat,
likes : 0,
dislikes : 0,
usersLiked : [],
usersDisliked : [],
})

product.save().
then((message) => {
    res.send({message: message});
    return console.log("Product saved", message)}).catch(console.error)
}

module.exports = { authenticateUser, createSauce, getSauceById }