
const express = require("express")
const cors=require('cors');
require("dotenv").config();
const app=express();
const bodyParser = require('body-parser');
const userRoutes=require("./Routes/userRoutes")
const startupRoutes=require("./Routes/startupRoutes");
const investorRoutes=require("./Routes/investorRoutes");
const emailRoutes=require("./Routes/emailRoutes")

const path = require('path');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json())
app.use("/user",userRoutes);
app.use("/startup",startupRoutes);
app.use("/investor",investorRoutes);
app.use("/email",emailRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // added by myslef

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Startup Connect API');
});

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

const mongoose=require("mongoose")

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected")
}).catch(err => {
    console.log(err)
})

app.listen(process.env.PORT || 3000 , () => {
    console.log(`App Listening on Port ${process.env.PORT}`)
})