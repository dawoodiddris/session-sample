const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs')
require("dotenv").config();

const userModel = require('./model/user')

const mongoDBSession = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');

const app = express()

const port = process.env.PORT || 8000;

mongoUri = process.env.CONNECTION_URL

mongoose.connect(mongoUri,{
useNewUrlParser:true,    
useUnifiedTopology:true
})
 .then((res) =>{
     console.log('MongoDB connected')
 })

const store = mongoDBSession({
    uri:mongoUri,
    collection:'sessionsCreated'
})

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:'The Key Here',
    resave: false,
    saveUninitialized: false,
    store
}))

const isAuth = (req,res, next) => {
     
  if(req.session.isAuth)
  {
      next()
  }else
  {
    return res.redirect("/login")
  }

}

app.get("/", (req, res) => {
    if(req.session.isAuth)
    {
        return res.redirect("/dashboard")
    } 
    console.log(req.session)
    console.log(req.session.id)
    res.render("landing")
})

app.get("/login", (req,res) => {
    
    if(req.session.isAuth)
    {
        return res.redirect("/dashboard")
    } 

    res.render("login")
})

app.post("/login", async(req,res) => {

    const { email, password } = req.body;

    let user = await userModel.findOne({email})

    if(!user)
    {
       return res.redirect("/login") 
    }

    const isMatch = await bcrypt.compare(password, user.password)

     console.log(isMatch)

    if(!isMatch)
    {
        return res.redirect("/login") 
    }else{
        req.session.isAuth = true;

        return res.redirect("/dashboard")
    }


})

app.get("/register", (req,res) => {
    if(req.session.isAuth)
    {
        return res.redirect("/dashboard")
    } 

    res.render("register")
})

app.post("/register", async(req,res) => {

    const {username, email, password } = req.body;

    let user = await userModel.findOne({email})

    const userHasrshPassword = await bcrypt.hash(password, 12)
     
    if(user){
        res.redirect("/register")
    }

    user = new userModel({
        username,
        email,
        password: userHasrshPassword
    })

    await user.save()

    res.redirect('/login')

})

app.get("/dashboard", isAuth, (req,res) => {

    res.render("dashboard")
})

app.post("/logout", (req,res) => {
     req.session.destroy((err) => {
         if(err){
             throw err;
         }
     } )

     return res.redirect("/")
})

app.listen(port, () => {
    console.log(`Your are listening to ${port} `)
})
