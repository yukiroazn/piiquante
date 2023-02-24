const express = require('express')
const router = express.Router()
const { getSauces, createSauce, modifySauce, getSauceById, deleteSauce, likeSauce } = require("../controllers/sauce")
const { auth } = require("../middleware/auth")
const { upload } = require("../middleware/multer")

router.get("/", auth, getSauces)
router.post("/", auth, upload.single("image"), createSauce)
router.put("/:id", auth, upload.single("image"), modifySauce)
router.get("/:id", auth, getSauceById)
router.delete("/:id", auth, deleteSauce)
router.post("/:id/like", auth, likeSauce)
router.get("/", (req, res) => res.send("hot takes"))

module.exports = { router }