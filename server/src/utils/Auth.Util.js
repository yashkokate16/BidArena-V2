import jwt from "jsonwebtoken";
import env from "../../src/config/env.js";


export let generateAccessToken = (userId) =>{
    
    return jwt.sign({userId}, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}


export let generateRefreshToken = (userId) =>{
    return jwt.sign({userId}, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}


export let verifyAccessToken = (token) => {
    try{
        return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new Error("Invalid access token");
    }
}

export let verifyRefreshToken = (token) => {
    try{
        return jwt.verify(token, env.REFRESH_TOKEN_SECRET); 
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
}




