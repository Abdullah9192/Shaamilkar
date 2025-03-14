const {getAllUsers} = require('./GetUsers');
const {updateUser} = require('./UpdateUser');
const {deleteUser} = require('./DeleteUser');
const {updateRole} = require('./UpdateRole');


const User = {
    user: getAllUsers,
    updateuser: updateUser,
    deleteuser: deleteUser,
    updaterole: updateRole
}

module.exports = User