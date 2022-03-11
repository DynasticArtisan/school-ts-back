const tokenService = require('../services/tokenService')

module.exports = async function( req, res, next ) {
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return res.status(403).json('Auth errror')
        }
        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken){
            return res.status(403).json('Auth errror')
        }
        const userData = await tokenService.validateAccessToken(accessToken)
        if(!userData){
            return res.status(401).json('Auth errror') 
        }
        req.user = userData
        next()
    } catch (e) {
        return res.status(401).json('Auth errror')
    }
}