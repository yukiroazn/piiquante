const mongoose = require("mongoose")
const fs = require('fs');

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


// Create Sauce /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createSauce(req, res) {
const { body, file } = req
const { filename } = file
const sauce = JSON.parse(body.sauce)
const { name,manufacturer, description, mainPepper, heat, userId } = sauce

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

// Get Sauce ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getSauces(req, res) {
Product.find({})
.then((products) => res.send(products))
.catch((error) => {
console.error(error);
res.status(500).send({ message: "Internal server error" });
});
}

// Clickable Sauce //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getSauceById(req, res) {
const { id } = req.params
Product.findById(id)
.then(product => res.send(product))
.catch(console.error)
}

// Function to delete a file path //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteFile(filePath) {
fs.unlink(filePath, (err) => {
if (err) {
console.error(err);
} else {
console.log(`${filePath} was deleted`);
}
});
}

// Delete Sauce ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteSauce(req, res) {
const { id } = req.params;
Product.findByIdAndDelete(id)
.then((product) => {
// Delete image at the same time when deleting a sauce
if (product.imageUrl) {
const imagePath = product.imageUrl.split('/').pop();
deleteFile(`images/${imagePath}`);
}
res.send({ message: product });
})
.catch(err => res.status(500).send({message: err}));
}

// Modify Sauce ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function modifySauce (req, res) {
const {params: {id} } = req;
const hasNewImage = req.file != null;
const payload = makePayload(hasNewImage, req);
  
Product.findByIdAndUpdate(id, payload)
.then((dbResponse) => {
// Delete old image if it existed when uploading a new iimage
if (hasNewImage && dbResponse.imageUrl) {
const oldImagePath = dbResponse.imageUrl.split('/').pop();
deleteFile(`images/${oldImagePath}`);
}
sendClientResponse(dbResponse, res);
})
.catch(err =>console.log("Update Error ",err));
}
// If a new image is uploaded, it replaces the old image URL with the new one
function makePayload(hasNewImage, req) {
console.log("hasNewImage", hasNewImage)
if (!hasNewImage) return req.body
const payload = JSON.parse(req.body.sauce)
payload.imageUrl = makeImageUrl(req, req.file.filename)
console.log("New image")
console.log("New body", req.body.sauce)
return payload
}

// This function work if all objects are deleted manually to MongoDB, this messasge error will appear in browser payload ///////////////////////////////////////////
// function sends a response to the client after a product is modified. It checks if the product exists and sends an appropriate response message to the client/////
function sendClientResponse(product, res) {
if (product == null) {
return res.status(404).send({ message: "Object not found"})
}
res.status(200).send({ message: "Update completed"})
}

function makeImageUrl(req, filename) {
return req.protocol + "://" + req.get("host") + "/images/" + filename
}

// Like and Dislike ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function likeSauce(req, res) {
const { id } = req.params;
const { userId } = req.body;
  
Product.findById(id)
.then((sauce) => {
if (!sauce) {
return res.status(404).send({ message: "Product not found" })
}
  
const userAlreadyLiked = sauce.usersLiked.includes(userId)
const userAlreadyDisliked = sauce.usersDisliked.includes(userId)
  
if (!userAlreadyLiked && !userAlreadyDisliked) {
// If user has not liked or disliked the sauce yet
sauce.likes += 1;
sauce.usersLiked.push(userId);
sauce.save();
res.status(200).send({ message: "Product liked" })
} else if (userAlreadyLiked) {
// If user already liked the sauce, remove like
sauce.likes -= 1;
sauce.usersLiked = sauce.usersLiked.filter((uid) => uid !== userId)
sauce.save();
res.status(200).send({ message: "Like removed" })
} else if (userAlreadyDisliked) {
// If user already disliked the sauce, "change to like"
sauce.likes += 1;
sauce.dislikes -= 1;
sauce.usersLiked.push(userId);
sauce.usersDisliked = sauce.usersDisliked.filter((uid) => uid !== userId)
sauce.save();
res.status(200).send({ message: "Like changed" })
}
})
.catch((err) => {
console.error(err);
res.status(500).send({ message: "Error" })
})
}

// Exports /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = { getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce }