const {signup , login, getSpecificUser ,  checkInvestorIdCorrespondingToUser, getAllUsers , adminLogin , updateSignupInfo, getAdmin , adminUpdate}=require("../Controller/userController");

const userRoutes = require("express").Router();

userRoutes.post("/signup" , signup)
userRoutes.post('/login',login)
userRoutes.get('/getSpecificUser/:id',getSpecificUser)
userRoutes.get('/checkInvestorIdCorrespondingToUser/:id', checkInvestorIdCorrespondingToUser)
userRoutes.get('/getAllUsers', getAllUsers)
userRoutes.post('/adminLogin',adminLogin)
userRoutes.put('/updateSignupInfo/:id',updateSignupInfo)
userRoutes.get('/getAdmin',getAdmin)
userRoutes.put('/adminUpdate/:id',adminUpdate)
module.exports = userRoutes;