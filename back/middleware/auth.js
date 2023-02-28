const jwt = require("jsonwebtoken") // Créer des token aléatoires uniques et sécuriser pour la connexion au compte
require("dotenv").config() // Pour protéger les informations de connexion vers la BDD

function auth(req, res, next) {
const header = req.header("Authorization"); // Récupérer le token dans le header autorisation
if (header == null) return res.status(403).send({ message: "Invalid" });

const token = header.split(" ")[1]; // Faire un split et récupérer le deuxième élément du tableau renvoyé
if (token == null) return res.status(403).send({ message: "Token cannot be null" });

jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => { // Je vérifie que le password respecte le schema et décoder le token en le vérifiant
if (err) return res.status(403).send({ message: "Token invalid" + err }); // Si on a un userId dans le corps de la requête et qu'il est différent du userId = erreur
req.user = decoded; // Extraire le userId grace au token
next(); // Si tout va bien, suivant
});
}

// J'exporte le module de token
module.exports = { auth }