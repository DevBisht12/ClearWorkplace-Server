import mongoose from "mongoose";
import validator from "validator";

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    Location: {
        type: String,
        required: true,
        trim: true
    },
    City: {
        type: String,
        required: true,
        trim: true
    },
    Area: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    jobType: {
        type: [String],
        required: true,
    },
    Pay: {
        type: [Number],
        required: true,
    },
    jobDescription: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: [validator.isEmail]
    },    
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    Applied: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    ]
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
