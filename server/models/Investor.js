const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import the startup model
//const Startup = require('../models/Startup'); // Adjust the path as necessary

const startupsApproachedSchema = new mongoose.Schema({
    startupsId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'startups',
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    },
    count:{
       type:Number,
    }
    
})
const summaryOfInvestmentSchema = new mongoose.Schema({
    startupsId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'startups',
        required:true
    }
})
const recieveMessageSchema=new mongoose.Schema({
   startupId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'startups',
    required:true
   },
   message:{
    type:String,
    required:true
   },
  status:{
    type:String,
    enum:['Pending' , 'Accepted' , 'Rejected'],
    default:'Pending'
  }
})

const investorSchema = new Schema({
    investorName: {
        type: String,
        //required: true
    },
    logo: {
        type: String, // Store binary data
        default: null
    },
    investorType: {
        type: String,
        enum: ['Individual', 'Venture Capital Firm', 'Private Equity Firm', 'Corporation', 'Government Agency', 'Crowdfunding', 'Institutional Investor' , ''],
        //required: true
    },
    summaryOfInvestment: [summaryOfInvestmentSchema],
    totalInvestmentsMade: {
        type: Number,
        //required: true
    },
    totalAmountInvested: {
        type: Number,
        //required: true
    },
    totalReturns: {
        type: Number,
        //required: true
    },
    startupsApproached:[startupsApproachedSchema],
    recentActivity: {
        type: String,
        //required: true
    },
    recieveMessage:{
        type:[recieveMessageSchema],
        //required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

const investorModel = mongoose.model('investors', investorSchema);
module.exports = investorModel;
