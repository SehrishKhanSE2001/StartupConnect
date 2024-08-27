


const express = require('express');
const router = express.Router();
const startupController = require('../Controller/startupController'); // Adjust the path as needed

// Route to register a new startup
router.get('/getAllStartups', startupController.getAllStartups);
router.get('/getStartupByUserId/:userId', startupController.getStartupByUserId);
router.get('/getStartupId/:startupId',startupController.getStartupId);
//router.post('updateStartup/:id', startupController.uploadFields, startupController.registerStartup); // Apply upload middleware here

router.post('/registerStartup', startupController.registerStartup);

router.delete('/deleteStartup/:id', startupController.deleteStartup);

router.delete('/deleteStartupByUserId/:id',startupController.deleteStartupByUserId)

router.delete('/deleteProduct/:startupId/:productId', startupController.deleteProduct);

router.delete('/deleteTeamMember/:startupId/:productId/:teamMemberId', startupController.deleteTeamMember);

router.put('/updateStartup/:id', startupController.updateStartup);

router.put('/updateStartupImageId/:id', startupController.uploadFields, startupController.updateStartupImageId);

// // Add feedback
// router.post('/:startupId/feedback', startupController.addFeedback);

// // Get feedback
// router.get('/:startupId/feedback', startupController.getFeedback);

// POST feedback for a specific startup
router.post('/addfeedback/:id', startupController.addFeedback);

// GET feedback for a specific startup
router.get('/getfeedback/:id', startupController.getFeedback);


module.exports = router;
