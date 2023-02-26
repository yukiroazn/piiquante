const { app, express } = require("./server") // Pour créer des applis web avec Node
const helmet = require('helmet') // Pour sécuriser les en-tête http de l'application express
const port = 3000
const path = require("path") // Pour pouvoir travailler avec les chemins des fichiers

// Connection to Database
require("./models/users")

// Importation controllers for users and sauces
const { router } = require("./routes/sauce")
const { users } = require("./routes/users")

// Routes
app.use("/api/sauces", router) // Api pour les sauces
app.use("/api/auth", users) // Api authorizer les utilisateurs
app.use("/images", express.static(path.join(__dirname, 'images'))) // Pour servir des fichiers statiques tels que des images, des fichiers CSS et des fichiers JS.
app.listen(port, () => console.log('listening on port' + port)) // pour lancer un serveur Web
app.use(helmet()) // Je protège l'appli de certaines vulnerabilités en protégeant les en-têtes