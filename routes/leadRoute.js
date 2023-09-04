const express = require('express');
const Lead = require('../controllers/leadController');
const router = express.Router();

router.post('/dashboard/v1/lead', function (req, res){
    Lead.createLead(req, res);
});

router.get('/dashboard/v1/lead', function (req,res){
    Lead.getLeadById(req, res);
});

router.patch('/dashboard/v1/lead', function (req, res){
    Lead.updateLeadById(req, res);
});

router.delete('/dashboard/v1/lead', function (req, res){
    Lead.deleteLeadById(req, res);
});

module.exports = router;