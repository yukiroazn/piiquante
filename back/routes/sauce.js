const express = require('express') // J'importe les npms nécessaires
const router = express.Router() // La fonction Router d'express permet de créer des routes individuelles pour créer des objets router

// J'importe les autres dépendances nécessaires
const { getSauces, createSauce, modifySauce, getSauceById, deleteSauce, likeSauce } = require("../controllers/sauce")
const { auth } = require("../middleware/auth")
const { upload } = require("../middleware/multer")

// Je configure les routes de sauce et ajouter "auth" + multer qui gère les images
router.get("/", auth, getSauces) // Afficher toutes les sauces dans la BDD
router.post("/", auth, upload.single("image"), createSauce) // afficher une sauce par son id
router.put("/:id", auth, upload.single("image"), modifySauce) // Modifier une sauce, seul l'user qui a ajouté la sauce peut le faire
router.get("/:id", auth, getSauceById) // Afficher une sauce par son id
router.delete("/:id", auth, deleteSauce) // Supprimer une sauce, seul l'user qui a ajouté la sauce peut le faire
router.post("/:id/like", auth, likeSauce) // Ajoute ou enlève un like à la sauce

module.exports = { router }