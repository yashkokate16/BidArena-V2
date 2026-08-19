import * as authService from "../services/auth.service.js";
import ApiError from "../utils/Api.Error.js";
import { access_cookie_options, refresh_cookie_options } from "../utils/cookie.utils.js";
import * as userDao from "../dao/user.dao.js";
import * as authUtils from "../utils/Auth.Util.js"
import { success } from "zod";



export let registerUser = async (req, res) =>{
   
    try{
        let {fullName, username, email, password} = req.body;

        if(!fullName || !username || !email || !password){
            throw new ApiError(
                400, 
                "All fields are required"
            );
        }
        let userData = { fullName, username, email, password };

        let {user, accessToken, refreshToken} = await authService.registerUser(userData);

        res.cookie("accessToken", accessToken, access_cookie_options);
        res.cookie("refreshToken", refreshToken, refresh_cookie_options);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}


export let loginUser = async(req, res) =>{

    try{
        let {email, password} = req.body;
     
        if(!email || !password){
            throw new ApiError(
                400, 
                "Email and password are required"
            );
        }


        let {user, accessToken, refreshToken} = await authService.loginUser(email, password);

        res.cookie("accessToken", accessToken, access_cookie_options);
        res.cookie("refreshToken", refreshToken, refresh_cookie_options);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });

    } catch (error) {
        console.error("Error in loginUser controller:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}


export let logoutUser = async (req, res) => {
    try{
        let refreshToken = req.cookies.refreshToken;
        
        let {message} = await authService.logoutUser(refreshToken);

        res.clearCookie("accessToken", access_cookie_options);
        res.clearCookie("refreshToken", refresh_cookie_options);

        return res.status(200).json({
            success: true,
            message: message
        });

    } catch(error){
         console.error("Error in logoutUser controller:", error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
    }
}


export let getUser = async (req, res) => {
    try{
        let user = await userDao.findUserById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })  
        }
        return res.status(200).json({
            success:true,
            message:"User fetched successfully",
                user:{
                    name:user.fullName,
                    id:user._id,
                    email:user.email
                }
        })

    } catch(error) {
         console.error("Error in getUser controller:", error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    res.status(500).json({
        success:false,
        message:"Failed to fetch user"
    });

    }
}


export let refreshToken = async (req, res) =>{
    try{
        let refreshToken = req.cookies.refreshToken

        if(!refreshToken){
            return res.status(401).json({
                success:false,
                message:"Refresh Token missing"
            })
        }

        let decode = authUtils.verifyRefreshToken(refreshToken)
        console.log(decode)
        console.log(decode.userId)

        if(!decode){
            return res.status(401).json({
                success:false,
                message:"Invalid refresh token"
            })
        }

        let newAccessToken = authUtils.generateAccessToken(decode.userId)

        res.cookie("accessToken", newAccessToken,access_cookie_options)

        return res.status(200).json({
            success:true,
            // newAccessToken,
            message:"Access token refresh successfully"
        })


    } catch(error) {
        console.error("Error in refreshToken controller:", error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success:false,
        message:error.message
    });

    }
}