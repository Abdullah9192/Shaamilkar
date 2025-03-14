const express = require("express");
const ApplicationController = express.Router();
const route = require("../../Controllers/Customer Application/index.js");
const { authenticate } = require("../../Middleware/Authentication/index.js");
const { authorize } = require("../../Middleware/Authorize/index.js");
const { upload } = require('../../Controllers/Customer Application/UpdateApplication.js');

ApplicationController.post('/createapplication',authenticate ,authorize(['user']), route.upload.fields([
    { name: 'cnicFrontPhoto', maxCount: 1 },
    { name: 'cnicBackPhoto', maxCount: 1 },
    { name: 'sixMonthBankStatement', maxCount: 1 },
    { name: 'lastPaySlip', maxCount: 1 },
    { name: 'utilityBill', maxCount: 1 }
  ]), route.PostApplication);

  ApplicationController.patch('/updateapplication/:Id', authenticate , authorize(['Credit Manager' , 'CFO', 'CEO' , 'Admin' , 'Loan Officer' , 'user']), upload, route.UpdateApplication);

ApplicationController.delete('/deleteapplication/:id' , authenticate , authorize(['user' , 'Admin', 'CFO' , 'CEO']), route.deleteapplication);
ApplicationController.get('/getsingleapplication/:Id'  , authenticate , authorize(['user']), route.getSingleApplication);
ApplicationController.get('/getapplication'  , authenticate , authorize([ 'Admin', 'CFO' , 'CEO' , 'Credit Manager', 'Loan Officer']), route.getapplication);




module.exports = ApplicationController;
