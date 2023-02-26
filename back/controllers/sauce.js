// J'importe les npm nécessaires 
const { Product } = require('../models/sauce')
// FS veut dire file-system, c'est ce qui nous permet de modifier et supprimer un fichier
const fs = require('fs');

// Create Sauce /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createSauce(req, res) {
const { body, file } = req
const { filename } = file
const sauce = JSON.parse(body.sauce) // Body parsé en objet js utilisable
const { name,manufacturer, description, mainPepper, heat, userId } = sauce

// On récupère toutes les infos du body
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

product.save(). // sauvegarder la sauce dans la BDD
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
const { id } = req.params // On trouve la sauce concernée par son id
Product.findById(id)
.then(product => res.send(product))
.catch(console.error)
}

// Function to delete a file path //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteFile(filePath) {
fs.unlink(filePath, (err) => { // Fonction pour supprimer l'image dans le système
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
const imagePath = product.imageUrl.split('/').pop(); // Récupérer l'imageUrl retournée par la BDD, stockée dans /images/
// Qu'on peut faire un split vu qu'elle est entre deux chemins donc split va séparer entre éléments //
deleteFile(`images/${imagePath}`);  // On supprime le lien entre l'ancienne image et la sauce en question
}
res.send({ message: product });
})
.catch(err => res.status(500).send({message: err}));
}

// Modify Sauce ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function modifySauce (req, res) {
const {params: {id} } = req; // On trouve la sauce concernée par son id
const hasNewImage = req.file != null; // Si la request concerne le changement du file, donc l'image
const payload = makePayload(hasNewImage, req);
  
Product.findByIdAndUpdate(id, payload)
.then((dbResponse) => {
// Delete old image if it existed when uploading a new iimage
if (hasNewImage && dbResponse.imageUrl) {
const oldImagePath = dbResponse.imageUrl.split('/').pop(); // Récupérer l'imageUrl retournée par la BDD, stockée dans /images/
// Qu'on peut faire un split vu qu'elle est entre deux chemins donc split va séparer entre éléments //
deleteFile(`images/${oldImagePath}`); // On met à jour la sauce avec la nouvelle image
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
payload.imageUrl = makeImageUrl(req, req.file.filename)  // On met à jour le reste du <body>
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
// On récupère l'id du user, l'id de la sauce et le like
const { id } = req.params; // Get the sauce ID from the request parameters
const { userId } = req.body; // Get the user ID from the request body
  
// Find the sauce with the given ID
Product.findById(id)
.then(sauce => {

// If the sauce does not exist, return an error response
if (!sauce) return res.status(404).send({ message: "Product not found" })
  
// Check if the user has already liked or disliked the sauce
const userAlreadyLiked = sauce.usersLiked.includes(userId)
const userAlreadyDisliked = sauce.usersDisliked.includes(userId)
  
// If the user has not liked or disliked the sauce yet, add a like
if (!userAlreadyLiked && !userAlreadyDisliked) {
if (req.body.like === 1) {
sauce.likes += 1
sauce.usersLiked.push(userId)
} else if (req.body.like === -1) {
sauce.dislikes += 1
sauce.usersDisliked.push(userId)
}
sauce.save()
res.status(200).send({ message: "Sauce liked/disliked" })
}

// If the user has already liked the sauce, remove the like
else if (userAlreadyLiked) {
if (req.body.like === 0) {
sauce.likes -= 1
sauce.usersLiked = sauce.usersLiked.filter(uid => uid !== userId)
} else if (req.body.like === -1) {
sauce.likes -= 1
sauce.dislikes += 1
sauce.usersLiked = sauce.usersLiked.filter(uid => uid !== userId)
sauce.usersDisliked.push(userId)
}
sauce.save()
res.status(200).send({ message: "Like removed/disliked" })
}

// If the user has already disliked the sauce, change to a like
else if (userAlreadyDisliked) {
if (req.body.like === 0) {
sauce.dislikes -= 1
sauce.usersDisliked = sauce.usersDisliked.filter(uid => uid !== userId)
} else if (req.body.like === 1) {
sauce.likes += 1
sauce.dislikes -= 1
sauce.usersDisliked = sauce.usersDisliked.filter(uid => uid !== userId)
sauce.usersLiked.push(userId)
}
sauce.save()
res.status(200).send({ message: "Like changed" })
}
})
.catch(err => {
console.error(err);
res.status(500).send({ message: "Error" })
})
}

// Exports /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = { getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce }