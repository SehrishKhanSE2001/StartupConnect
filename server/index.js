const express = require('express')
const app=express()

const UserModel=require('./models/User')

const mongoose=require('mongoose')

const DB='mongodb+srv://ProjectCluster:iatID4KAQO1aI2cg@cluster1.uvj0x4n.mongodb.net/StartupConnect_Database?retryWrites=true&w=majority&appName=Cluster1'

mongoose.connect(DB , {
    
}).then(() => {

    console.log('connection is successful')
}).catch((err)=> console.log('no connection', err))


// adding user 
app.post("/addUser", async (req, res) => {
    const user = req.body;
    const NewUser = new UserModel(user);

    try {
        const savedUser = await NewUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
   console.log('Server runs perfectly')
})





