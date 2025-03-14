const express = require('express');
const OneLinkController = express.Router();
const route = require('../../Controllers/OneLink/index.js');

OneLinkController.post('/' , route.Register);
OneLinkController.post('/billinquiry' , route.BillInquiry);
OneLinkController.post('/paymenttransaction' , route.Billpayment);
OneLinkController.get('/getalltransaction' , route.GetAllTransactions);
OneLinkController.get('/getsingletransaction/transAuthId' , route.GetSingleTransaction);



module.exports = OneLinkController