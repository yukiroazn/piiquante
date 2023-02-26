const mongoose = require('mongoose') // J'importe les npm nécessaires

// Le modèle schema pour les infos sur la sauce
const productSchema = new mongoose.Schema({
userId: String,
name: String,
manufacturer: String,
description: String,
mainPepper: String,
imageUrl: String,
heat: Number,
likes: Number,
dislikes: Number,
usersLiked: [String],
usersDisliked: [String],
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }