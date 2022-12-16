import mongoose from "mongoose";

export const multiIdValidator = (idArray: Array<any>): boolean => {
    const validatorArray = idArray.map(id => {
        if (mongoose.Types.ObjectId.isValid(id)) {
            return true
        };
        return false
    });
    const result = validatorArray.some(el => el === false);
    return result;
};   