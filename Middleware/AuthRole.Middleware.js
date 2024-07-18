import { Company } from "../DataBase/Modals/employerModal.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = "jslfdkjslkfjlskdjflskdjfsdkl";

const authorizeRoles = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }

        const { id } = jwt.verify(token, JWT_SECRET);
        const company = await Company.findById(id); 

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Not found!"
            });
        }

        if (company.role !== 'employer') {
            return res.status(403).json({
                success: false,
                message: "Not authorized for this action"
            });
        }

        req.company = company; 
        next();

    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export default authorizeRoles;
