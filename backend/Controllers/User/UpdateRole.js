const prisma = require ('../../Config/database.js');

const updateRole = async (req , res)=>{

    const { id }  = req.params;
    const AppIdInt = parseInt(id, 10);
    const Id   = AppIdInt;
    const { role } = req.body;

    try{
    const user = await prisma.user.findUnique({
        where: { id : Id }
    })
    if(!user){
        return res.status(200).json({
            status: "error",
            message: "No user found",
            statusCode: 404
        })
    }
    const updatedRole = await prisma.user.update({
    where: { id : Id },
    data: { role }
    })
    return res.status(200).json({
    status: "success",
    message: "Role Updated Successfully",
    statusCode: 200,
    updatedRole
    })

    }catch (error) {
    console.error('Error in updating role:', error);
    res.status(200).json({
        status: 'error',
        message: 'Internal server error. Please try again later.',
        statusCode: 500,
        data: null  
    }); 
 }
};

module.exports = {
    updateRole
};