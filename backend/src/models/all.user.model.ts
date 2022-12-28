import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface User {
    email: string;
    password: string;
    name: string;
    userType: string;
    resetToken?: string;
    resetTokenExpires?: Date;
};

export interface UserDocument extends User, mongoose.Document {
    matchPassword: (password: string) => Promise<boolean>,
    getResetToken: () => string
};

interface UserModel extends mongoose.Model<UserDocument> {
    instanceOfUser: (param: any) => param is UserDocument
};

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
    email: {
        type: String,
        required: [true, "email is required"],
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["Seller", "Buyer"]
    },
    resetToken: {
        type: String
    },
    resetTokenExpires: {
        type: Date
    }
}, { timestamps: true });

userSchema.pre("save", async function (next: any): Promise<void> {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function (): string {
    let token = crypto.randomBytes(20).toString("hex");
    this.resetToken = crypto.createHash("sha256").update(token).digest("hex");
    this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
    return token;
};

userSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
    const user = this;
    return await bcrypt.compare(password, user.password);
};

userSchema.statics.instanceOfUser = (param: any): param is UserDocument => {
    return param.email !== undefined;
}

const Users = mongoose.model<UserDocument, UserModel>("Users", userSchema);

export default Users