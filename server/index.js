// const express = require('express');
// require("dotenv").config();
// const app = express();
// const mongoose = require('mongoose');
// const UserModel = require('./models/User');

// // Middleware to parse JSON bodies
// app.use(express.json());

// const DB = 'mongodb+srv://ProjectCluster:iatID4KAQO1aI2cg@cluster1.uvj0x4n.mongodb.net/StartupConnect_Database?retryWrites=true&w=majority&appName=Cluster1';

// mongoose.connect(DB, {})
//     .then(() => {
//         console.log('Connection is successful');
//     })
//     .catch((err) => {
//         console.log('No connection', err);
//     });

// app.post("/addUser", async (req, res) => {
//     const user = req.body;
//     console.log('Received user:', user); // Debugging line
//     const NewUser = new UserModel(user);

//     try {
//         const savedUser = await NewUser.save();
//         res.status(201).json(savedUser);
//     } catch (error) {
//         console.error('Error saving user:', error); // Debugging line
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(3001, () => {
//     console.log('Server runs perfectly');
// });

const express = require("express")
const cors=require('cors');
require("dotenv").config();
const app=express();
const bodyParser = require('body-parser');
const userRoutes=require("./Routes/userRoutes")
const startupRoutes=require("./Routes/startupRoutes");
const investorRoutes=require("./Routes/investorRoutes");

const path = require('path');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json())
app.use("/user",userRoutes);
app.use("/startup",startupRoutes);
app.use("/investor",investorRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // added by myslef

const mongoose=require("mongoose")

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected")
}).catch(err => {
    console.log(err)
})

app.listen(process.env.PORT || 3000 , () => {
    console.log(`App Listening on Port ${process.env.PORT}`)
})