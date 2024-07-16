import mongoose from "mongoose";
import validator from 'validator';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},
);

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please enter your company name'],
    trim: true,
  },
  companyEmail: {
    type: String,
    unique: true,
    required: [true, 'Please enter your email'],
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  companyNumber: {
    type: Number,
    required: [true, 'Please enter your company number'],
    minlength: [10, 'Contact number must be at least 10 digits long.']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
  companySize: {
    type: String,
    required: [true, 'Please enter your company size'],
  },
  aboutCompany: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqSSWPyT5fIJ0weLBlc34H9fGaID6qfjrROag5rB8ijZ0lbB4xzLMKgV3kRsPWv94WZzs&usqp=CAU'
  },
  coverPicture: {
    type: String,
    default: 'https://i.postimg.cc/j2TJjgpH/Frame-2-1.jpg'
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  averageRating: { type: Number, default: 0 },
  reviews: [reviewSchema],
  role: {
    type: String,
    default: 'employer'
  },
  jobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
});

export const Company = mongoose.model("Company", companySchema);
