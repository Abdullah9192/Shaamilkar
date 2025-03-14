const express = require("express");
const UserController = express.Router();
const route = require("../../Controllers/User/index.js");
const { authenticate } = require("../../Middleware/Authentication/index.js");
const { authorize } = require("../../Middleware/Authorize/index.js");


UserController.get('/AllUsers' , authenticate ,  authorize(['Admin', 'CFO' , 'CEO']) , route.user);
UserController.patch('/updateuser/:Id' ,authenticate , route.updateuser);
UserController.delete('/deleteuser/:Id' ,authenticate  , route.deleteuser);
UserController.patch('/updaterole/:id', authenticate ,  authorize(['Admin', 'CFO' , 'CEO'])  , route.updaterole);


module.exports = UserController;
