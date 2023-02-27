// Multer est un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP.
// Ici, ce sera les images téléchargées par les users
const multer = require("multer");

// Générer le format des images
const imageFilter = function(req, file, cb) {
if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp)$/)) { // J'authorise les types de fichier pour générer les extensions possibles
req.fileValidationError = 'Only image files are allowed!'
return cb(new Error('Only image files are allowed JPG,PNG,WEBP!'), false)
}
cb(null, true)
}

// On enregistre les images téléchargées par le user dans le disc
const storage = multer.diskStorage({
destination: "images/", // La destination
filename: function(req, file, cb) {
// Renvoie en callback le nom du fichier final
cb(null, Date.now() + "-" + file.originalname)
}
})

// On crée une constante pour stocker les options de Multer
const uploadOptions = 
{
storage: storage,
fileFilter: imageFilter,
limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5MB
}

const upload = multer(uploadOptions)

module.exports = { upload }
