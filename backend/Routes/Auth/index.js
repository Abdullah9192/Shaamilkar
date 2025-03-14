const express = require('express');
const AuthController = express.Router();
const route = require('../../Controllers/Auth/index.js');

AuthController.post('/registration' , route.register);
AuthController.post('/login' , route.Login);
AuthController.post('/requestOtp' , route.RequestOtp);
AuthController.post('/verifyOtp' , route.VerifyOtp);
AuthController.post('/resetPassword' , route.ResetPassword);


module.exports = AuthController