const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const auth = require('./middleware/auth')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const { login, register, logout } = require('./controllers/authentication')


require('dotenv').config()

const currencyRoutes = require('./routes/currencies')

const app = express()
const port = 5000

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

// parse application/json
app.use(bodyParser.json())

//middleware for cookies
app.use(cookieParser())

app.use('/', currencyRoutes)
// app.all('*', (req, res) => res.send("That route doesn't exist"))

// Register
app.post('/register', register)

// Login
app.post('/login', login)

// Login
app.get('/logout', logout)

app.post('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ')
})



//---------------------------Mongoose----------------------------------
const mongoose = require('mongoose')
const res = require('express/lib/response')
mongoose.connect(
  'mongodb+srv://Aldo:aldo123@cluster0.35kk7.mongodb.net/Cluster0?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
//---------------------------End Mongoose-------------------------------

app.listen(port, () =>
  console.log(`Server is listening on port: http://localhost:${port}`),
)
