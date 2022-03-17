const tokenService = require('../services/tokenService')

module.exports = async function( req, res, next ) {
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return res.status(403).json('Доступ запрещен')
        }
        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken){
            return res.status(403).json('Доступ запрещен')
        }
        const userData = await tokenService.validateAccessToken(accessToken)
        if(!userData || !userData.isActivated){
            return res.status(401).json('Доступ запрещен') 
        }
        req.user = userData
        next()
    } catch (e) {
        return res.status(401).json('Доступ запрещен')
    }
}