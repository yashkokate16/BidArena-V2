import * as authUtil from "../utils/Auth.Util.js";


export let authMiddleware = async (req, res, next) => {

    let accessToken = req.cookies.accessToken

    if(!accessToken) {
        return res.status(401).json({
            success:false,
            message:"Access Token is missing"
        })
    }

    try{
        let decode = authUtil.verifyAccessToken(accessToken)
        req.userId = decode.userId
        console.log("Id =>",decode.userId)
        next()
    } catch(error) {
        return res.status(401).json({
            success:false,
            message:"Invalid access Token"
        })
    }
}



