import mongoose from "mongoose";
import validator from "validator";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      // required: [true, 'Please enter the company name']
    },
    // Not listed Company
    companyName: {
      type: String,
    },
    position: {
      type: String,
      required: [true, "Please enter the position"],
    },
    EmploymentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Self-employed",
        "Freelance",
        "Trainee",
      ],
      default: "Please select",
    },
    locationType: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      default: "Please select",
    },
    description: {
      type: String,
      required: [true, "Please enter the description"],
    },
    from: {
      type: Date,
      required: [true, "Please enter the start date"],
    },
    to: Date,
    currentCompany: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, "Please enter the institution name"],
    },
    degree: {
      type: String,
      required: [true, "Please enter the degree"],
    },
    fieldOfStudy: {
      type: String,
      required: [true, "Please enter the field of study"],
    },
    startDate: {
      type: Date,
      required: [true, "Please enter the start date"],
    },
    endDate: Date,
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    review: {
      type: String,
    //   required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name must be less than 30 characters"],
    minLength: [3, "Name must be more than 3 characters"],
  },
  email: {
    type: String,
    unique: [true, "This email is already registered with us"],
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  profilePicture: {
    type: String,
    default: "https://res.cloudinary.com/dzjxqjx7k/image/upload",
  },
  coverPicture: {
    type: String,
  },
  bio: {
    type: String,
    default: "No Bio",
  },
  location: String,
  role: {
    type: String,
    default: "user",
  },
  skills: {
    type: [String],
  },
  experience: {
    type: [experienceSchema],
    default: [],
  },
  education: {
    type: [educationSchema],
    default: [],
  },
  reviews: {
    type: [reviewSchema],
    default: [],
  },
  averageRating: { type: Number, default: 0 },
  myAllJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

export const User = mongoose.model("User", userSchema);
