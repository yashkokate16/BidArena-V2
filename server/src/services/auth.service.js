import * as userDao from "../dao/user.dao.js";
import ApiError from "../utils/Api.Error.js";
import * as authUtil from "../utils/Auth.Util.js";



export let registerUser = async (userData) =>{

  

    let {fullName, username, email, password} = userData;

    let emailIsExist = await userDao.findUserByEmail(email);

    if(emailIsExist){
        throw new ApiError(
            409, 
            "Email already exists"
        );
     }


     let isUserNameExist = await userDao.findUserByUsername(username);  

     if(isUserNameExist){
        throw new ApiError(
            409, 
            "Username already exists"
        );
     }  

     let user = await userDao.createUser(userData);
     
       let accessToken = authUtil.generateAccessToken(user._id);
       let refreshToken = authUtil.generateRefreshToken(user._id);

    return { accessToken, refreshToken, user };

}

export let loginUser = async (email, password) =>{
    
    let user = await userDao.findUserByEmail(email);

    if(!user){
        throw new ApiError(
            404, 
            "User not found"
        );
     }
     console.log("user.isBlocked", user.isBlocked)

     if(user.isBlocked){
        throw new ApiError(
            403, 
            "User is blocked"
        );
     }

     let isPasswordValid = await user.comparePassword(password);


     if(!isPasswordValid){
        console.log("Invalid password")
        throw new ApiError(
            401, 
            "Invalid password"
        );
     }
     
     let accessToken = authUtil.generateAccessToken(user._id);
     let refreshToken = authUtil.generateRefreshToken(user._id);

        return { accessToken, refreshToken, user };


}


export let refreshAccessToken = async (refreshToken) => {
    if(!refreshToken){
        throw new ApiError(
            400, 
            "Refresh token is required"
        );
    }

    let decoded = authUtil.verifyRefreshToken(refreshToken);

    if(!decoded){
        throw new ApiError(
            401, 
            "Invalid refresh token"
        );
    }

    let user = await userDao.findUserById(decoded.userId);

    let compareRefreshToken = authUtil.verifyRefreshToken(refreshToken);

    if(!compareRefreshToken){
        throw new ApiError(
            401, 
            "Invalid refresh token"
        );
    }

    let newAccessToken = authUtil.generateAccessToken(user._id);

    return { accessToken: newAccessToken, user };


}    


export let logoutUser = async (refreshToken) => {
        if(!refreshToken){
            throw new ApiError(
                400, 
                "Refresh token is required"
            );
        }
        let decoded = authUtil.verifyRefreshToken(refreshToken);

        if(!decoded){
            throw new ApiError(
                401, 
                "Invalid refresh token"
            );
        }
        return {
            success: true,
            message: "User logged out successfully" };
    
}
