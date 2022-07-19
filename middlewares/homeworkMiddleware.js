const roles = require("../utils/roles");

module.exports = async function (req, res, next){
  try {
    const { role, id: user } = req.user;
    if(role === roles.user){

    } else {
      next(ApiError.Forbidden())
    }
    if(req.method === 'POST'){
      
      const { exercise } = req.body;
    }
    const { id } = req.params;
  } catch (e) {
      next(e)
  }

}