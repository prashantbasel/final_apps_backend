const jwt = require('jsonwebtoken')
const authGuard = (req, res, next) => {
    // check incoming data
    console.log(req.headers)// passed 

    // get authorrization data header
    const authHeader = req.headers.authorization;
    // check or validate
    if (!authHeader) {
        return res.status(400).json({
            "success": false,
            "message": "auth herader not found"
        })
    }

    // split the data(foramt:'Bearer <token>')
    const token = authHeader.split(' ')[1]
    // get token
    if (!token || token === '') {
        return res.status(400).json({
            "success": false,
            "message": "token not found"
        })
    }
    // verify token
    try {
        const decodeUserData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodeUserData;
        next()

    } catch (error) {
        res.status(400).json({
            "success": false,
            "message": "not authenticated"
        })
    }
    // if verified : next(function in controller)
    // not verified : not auth
    // if token not found : stop the process 
    // if verified : next(function in controller)
    // not verified : not auth
}

// Admin guard 
const adminGuard = (req, res, next) => {
    // check incoming data
    console.log(req.headers)// passed 

    // get authorrization data header
    const authHeader = req.headers.authorization;
    // check or validate
    if (!authHeader) {
        return res.status(400).json({
            "success": false,
            "message": "auth herader not found"
        })
    }

    // split the data(foramt:'Bearer <token>')
    const token = authHeader.split(' ')[1]
    // get token
    if (!token || token === '') {
        return res.status(400).json({
            "success": false,
            "message": "token not found"
        })
    }
    // verify token
    try {
        const decodeUserData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodeUserData; // user info : id only ,isAdmin
        if (!req.user.isAdmin) {
            return res.status(400).json({
                "success": false,
                "message": "permissson denied"
            })
        }
        next()

    } catch (error) {
        res.status(400).json({
            "success": false,
            "message": "not authenticated"
        })
    }
   
}
module.exports = {
    authGuard,
    adminGuard
}