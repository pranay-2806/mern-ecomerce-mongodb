const express=require("express")
const auth=express.Router()

const{register}=require("../controllers/register")
const{login}=require("../controllers/login")
const{forgotPassword}=require("../controllers/forgotPassword")


auth.post('/register',register)
auth.post('/login',login)
auth.post("/forgotpassword",forgotPassword)

module.exports=auth
