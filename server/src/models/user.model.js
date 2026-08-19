import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// userSchema.pre("save", async function(next) {
//     if(!this.isModified("password")) {

//         return next();
//     }

//     this.password = await bcrypt.hash(this.password, 10);

//     next();
// })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    if (!this.password) {
        return;
    }

    let hasdedPassword = await bcrypt.hash(this.password, 10);
    this.password = hasdedPassword;
});

userSchema.methods.comparePassword = async function(password) {
    if(!this.password){
        return false;
    }
    return await bcrypt.compare(password, this.password);
}


let userModel = mongoose.model("User", userSchema);

export default userModel;

