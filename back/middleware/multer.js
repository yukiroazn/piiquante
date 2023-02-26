// Multer est un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP.
// Ici, ce sera les images téléchargées par les users
const multer = require("multer");

// Générer le format des images
const imageFilter = function(req, file, cb) {
// J'authorise les types de fichier pour générer les extensions possibles
if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp)$/)) {
req.fileValidationError = 'Only image files are allowed!';
return cb(new Error('Only image files are allowed!'), false);
}
cb(null, true)
}

// On enregistre les images téléchargées par le user dans le disc
const storage = multer.diskStorage({destination: "images/", // La destination
filename: function(req, file, cb) { // Renvoie en callback le nom du fichier final
cb(null, Date.now() + "-" + file.originalname) // Avec la date + nom de fichier
}
})

// J'exporte multer en appelant le module storage
const upload = multer({ storage: storage, fileFilter: imageFilter })

module.exports = { upload }