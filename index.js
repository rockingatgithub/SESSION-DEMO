const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const multer = require('multer')
const session = require('express-session')
const mongoDB = require('./config/mongoose')
const passport = require('./config/passportLocalStrategy')
const User = require('./model/User')
const PORT = 8000

const upload = multer({ dest: 'documents/' })

const app = express()

app.use(express.urlencoded())

// app.use(cookieParser())

app.use(session({
    secret: 'my-token',
}))

app.use(passport.initialize())
app.use(passport.session())


const checkAuthentication = (req, res, next) => {

    if(req.user) { return next() }
    return res.status(401).json({ message: "Unautorized" })

}

app.post('/signup', async (req, res) => {

    const user = await User.create(req.body)

    return res.status(200).json({ data: user })

})

app.post('/signin', passport.authenticate('local', { failureRedirect: '/api', session: true }) ,async (req, res) => {

 console.log("the user", req.user)

 return res.status(200).json({ message: "User signin successfull!", user: req.user })

})

app.get('/api', checkAuthentication , (req, res) => {

    // res.setHeader("Set-Cookie", ["UserID=sudhendrasingh", "Year=2024"])
    // res.cookie()

    // if(req.session) {
    //     req.session.userID = "email"
    //     console.log("session", req.session)
    // }

    console.log("request cookies", req.cookies)
    return res.send({ message: "Normal HTTP api!" })

})

app.get('/home', (req, res) => {
    return res.sendFile(path.join(__dirname, '/index.html'))
})

app.post( '/fileUpload', upload.single('document') , (req, res) => {

    console.log("The request body", req.body, req.file)
    return res.send({ message: "File uploaded" })

} )


mongoDB.then( () => {
    app.listen(PORT, () => {console.log("Server is running!")})
} )