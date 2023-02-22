const { app, express } = require("./server")
const port = 3000
const path = require("path")

// Importation to connect to Database
require("./mongo")

// Importation controllers for creating new users
const { createUser, logUser } = require("./controllers/users")
const { authenticateUser, createSauce, getSauceById } = require("./controllers/sauce")

// Middleware
const { upload } = require("./middleware/multer")

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authenticateUser)
app.post("/api/sauces", upload.single("image"), createSauce)
app.get("/api/sauces/:id", getSauceById)
app.get("/", (req, res) => res.send("hot takes"))

// Listen
app.use("/images", express.static(path.join(__dirname, 'images')))
app.listen(port, () => console.log('listening on port' + port))