import { UserDocument } from "../../src/models/all.user.model.js";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument | null
        }
    }
}