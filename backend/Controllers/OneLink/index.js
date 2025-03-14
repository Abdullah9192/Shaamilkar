const {createUser} = require('./CreateUser');
const {billinquiry} = require('./BillInquiry');
const {billPayment} = require('./PostBillPayment');
const {getAllTransactions , getSingleTransaction} = require('./GetAllTransaction');


const Auth = {
    Register: createUser,
    BillInquiry: billinquiry,
    Billpayment: billPayment,
    GetAllTransactions: getAllTransactions,
    GetSingleTransaction: getSingleTransaction
}

module.exports = Auth