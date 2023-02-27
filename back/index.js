const { app, express } = require("./server"); // Pour créer des applis web avec Node
const helmet = require('helmet'); // Pour sécuriser les en-tête http de l'application express
const port = 3000;
const path = require("path"); // Pour pouvoir travailler avec les chemins des fichiers

// Connection to Database
require("./models/users");

// Importation controllers for users and sauces
const { router } = require("./routes/sauce");
const { users } = require("./routes/users");

// Middleware
const mongoSanitize = require('express-mongo-sanitize'); // To sanitize user input for MongoDB queries
const rateLimit = require("express-rate-limit"); // To rate limit requests

// Limit the rate of requests made to the API to 100 requests per 15 minutes
const limiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 100, // limit each IP to 100 requests per windowMs
message: "Too many requests from this IP, please try again in 15 minutes"
})

// Routes
app.use(mongoSanitize()); // Sanitize user input to prevent MongoDB injection attacks
app.use(limiter); // Apply rate limiting to all routes
app.use("/api/sauces", router); // Api pour les sauces
app.use("/api/auth", users); // Api authorizer les utilisateurs
app.use("/images", express.static(path.join(__dirname, 'images'))); // Pour servir des fichiers statiques tels que des images, des fichiers CSS et des fichiers JS.
app.use(helmet()); // Je protège l'appli de certaines vulnerabilités en protégeant les en-têtes

app.listen(port, () => console.log('listening on port' + port)); // pour lancer un serveur Web
