const mongoose = require('mongoose');

const summaryOfInvestmentSchema=new mongoose.Schema({
    investorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'investors',
        required: true
    },
   
})
const interestedInvestorSchema = new mongoose.Schema({
    investorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'investors',
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    },
    count: {
        type: Number,
        default: 1
    }
});

const teamMemberSchema = new mongoose.Schema({
    teammembername: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    information: {
        type: String,
        required: true
    },
    teammembers: {
        type: [teamMemberSchema],
        required: true
    }
});

const sendMessageSchema = new mongoose.Schema({
    investorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'investors',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }
});

const startupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    founders: {
        type: [String],
        required: true
    },
    aim: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    businessPlan: {
        type: String,
        required: true
    },
    projections: {
        type: String,
        required: true
    },
    product: {
        type: [productSchema],
        required: true
    },
    logo: {
        type: String, // Store binary data
        default: null
    },
    teamImage: {
        type: String, // Store binary data
        default: null
    },
    sendMessage: {
        type: [sendMessageSchema],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    mostViewed:{
        type:Number,
        required:true,
        default:0
    },
   
    interestedInvestors: [interestedInvestorSchema] ,
    summaryOfInvestment:[summaryOfInvestmentSchema]

    
    
});

const startupModel = mongoose.model('startups', startupSchema);
module.exports = startupModel;
