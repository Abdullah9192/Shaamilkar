const {createUser} = require('./registration');
const {login} = require('./login');
const {requestOtp , verifyOtp , resetPassword} = require('./ForgetPassword');


const Auth = {
    register: createUser,
    Login: login,
    RequestOtp: requestOtp,
    VerifyOtp: verifyOtp,
    ResetPassword: resetPassword
}

module.exports = Auth