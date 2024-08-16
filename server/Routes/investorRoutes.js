const express = require('express');
const router = express.Router();
const investorController = require('../Controller/investorController'); // Adjust the path as needed

router.get('/getAllInvestors',investorController.getAllInvestors);

router.get('/getInvestorById/:id',investorController.getInvestorById);

router.get('/getInvestorByUserId/:userId',investorController.getInvestorByUserId);

// Route to create a new investor
router.post('/addInvestor',investorController.uploadFields, investorController.addInvestor);

// Route to add an investment to an existing investor
router.delete('/deleteInvestor/:id', investorController.deleteInvestor);

// Route to update the status of an investment
router.put('/updateInvestor/:id', investorController.uploadFields,investorController.updateInvestor);

module.exports = router;
