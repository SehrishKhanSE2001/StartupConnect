const {signup , login, getSpecificUser}=require("../Controller/userController");

const userRoutes = require("express").Router();

userRoutes.post("/signup" , signup)
userRoutes.post('/login',login)
userRoutes.get('/getSpecificUser/:userId',getSpecificUser)


module.exports = userRoutes;