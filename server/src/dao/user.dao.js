// create user
// findbyemail
// findbyid
// findbyusername


import userModel from "../models/user.model.js";

export let createUser = async ({fullName, username, email, password}) =>{
   
    return await userModel.create({fullName, username, email, password});
}

export let findUserByEmail = async (email) =>{
    
    return await userModel.findOne({email})
    .select("+password");
}

export let findUserById = async (id) =>{
    return await userModel.findById(id);
}


export let findUserByUsername = async (username) =>{
    return await userModel.findOne({username});
}   

