// Multer est un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP.
// Ici, ce sera les images téléchargées par les users
const multer = require("multer")

// On enregistre les images téléchargées par le user dans le disc
// La config de multer nécessite deux arguments : destination + filename prenant prenant 3 params chacun
const storage = multer.diskStorage({destination: "images/", filename: makeFilename}) // La destination

function makeFilename(req, file, cb) // Renvoie en callback le nom du fichier final
{cb(null, Date.now() + "-" + file.originalname)} // Avec la date + nom de fichier

// J'exporte multer en appelant le module storage
const upload = multer({ storage: storage })
module.exports = { upload }