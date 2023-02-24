const { app, express } = require("./server")
const port = 3000
const path = require("path")

// Connection to Database
require("./mongo")

// Importation controllers for users and sauces
const { createUser, logUser } = require("./controllers/users")
const { router } = require("./routes/sauce")

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.use("/api/sauces", router)

// Listen
app.use("/images", express.static(path.join(__dirname, 'images')))
app.listen(port, () => console.log('listening on port' + port))