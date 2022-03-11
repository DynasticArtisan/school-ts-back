module.exports = async function (req, res, next){
    try {
        if(req.role != 'super'){
            return res.json({ message:"Forbidden" })
        }
        next()
    } catch (e) {
        next(e)
    }

}