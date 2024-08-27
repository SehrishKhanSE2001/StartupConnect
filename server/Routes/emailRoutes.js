const express=require('express');
const router=express.Router();
const emailController=require('../Controller/emailController');

router.post('/SendEmail',emailController.SendEmail)

module.exports=router;