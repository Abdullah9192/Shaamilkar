const {createApplication , upload} = require('./PostApplication');
const {updateApplication} = require('./UpdateApplication');
const {DeleteApplication} = require('./DeleteApplication');
const{GetApplication} = require('./GetApplication');
const{GetSingleApplication} = require('./GetSingleApplication');


const Auth = {
    PostApplication: createApplication,
    UpdateApplication: updateApplication,
    getSingleApplication: GetSingleApplication,
    deleteapplication: DeleteApplication,
    getapplication: GetApplication,
    upload: upload
}

module.exports = Auth