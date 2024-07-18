import postmark from "postmark";
import { User } from "../DataBase/Modals/userModal.js";
import { Company } from "../DataBase/Modals/employerModal.js";
import jwt from "jsonwebtoken";
import Job from "../DataBase/Modals/JobModal.js";
import dotenv from 'dotenv'
// import sgMail from '@sendgrid/mail'


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// const client = new postmark.ServerClient(
//   "f7510941-bd8c-4ef9-9e38-68b83eff13a8"
// );

class UserController {
  static async registerUser(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }

      const userExist = await User.findOne({ email });

      if (userExist) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      //   const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({ name, email, password });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      if (!email && !password) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
      // const comparedPassword
      const token = jwt.sign(
        { _id: user._id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: "48h" }
      );
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token: token,
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const token = req.headers.authorization;
      // console.log(token)
      if (!token && !oldPassword && !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const { _id } = jwt.verify(token, JWT_SECRET);
      console.log("id from token", _id);
      const user = await User.findById(_id).select("password");
      console.log("user", user);
      if (user.password != oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }
      user.password = newPassword;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password Changed Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const emailParams = {
        From: "raahulbisht12@gmail.com",
        To: "rahulsinghbisht420@gmail.com",
        Subject: "Testing...",
        TextBody: "Hello! This is a test email sent using Postmark.",
      };
      const testEmail = await client.sendEmail(emailParams);
      res.status(200).json({
        success: true,
        message: "Email Sent Successfully",
        testEmail,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async updateUserProfile(req, res) {
    try {
      const token = req.headers.authorization;
      const { profilePhoto, coverPhoto, bio, tags, experience, education } =
        req.body;

      console.log(token);

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized User",
        });
      }

      const verifyToken = jwt.verify(token, JWT_SECRET);
      const updateUser = await User.findByIdAndUpdate(
        verifyToken._id,
        { profilePhoto, coverPhoto, bio, tags, experience, education },
        { new: true }
      );

      if (!updateUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User Profile Updated Successfully",
        data: updateUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  }

  static async applyJob(req, res) {
    try {
      const token = req.headers.authorization;
      const { jobId } = req.body;

      if (!token || !jobId) {
        return res.status(400).json({
          success: false,
          message: "Token and job ID are required.",
        });
      }

      const { _id } = jwt.verify(token, JWT_SECRET);

      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { $push: { myAllJobs: jobId } }, //The $push operator adds a value to an array field. If the array field does not exist, it will create the field and then add the value to the array.
        { new: true }
      );

      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { Applied: _id } }, // The $addToSet operator adds a value to an array only if the value does not already exist in the array. This ensures that duplicates are not added to the array.
        { new: true }
      );

      if (!updatedUser || !updatedJob) {
        return res.status(404).json({
          success: false,
          message: "Failed to apply for the job.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Applied successfully.",
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      return res.status(500).json({
        success: false,
        message: "Server error.",
        error: error.message,
      });
    }
  }

  static async addExperience(req, res) {
    try {
      const {
        company,
        companyName,
        position,
        EmploymentType,
        locationType,
        description,
        from,
        to,
        currentCompany,
      } = req.body;
      const token = req.headers.authorization;
      console.log(token);
      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Unauthorize user",
        });
      }
      const addExperience = {
        company,
        companyName,
        position,
        EmploymentType,
        locationType,
        description,
        from,
        to,
        currentCompany,
      };
      const { _id } = jwt.verify(token, JWT_SECRET);
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { $push: { experience: addExperience } },
        { new: true }
      );
      if (company) {
        const addUserToCompany = await Company.findByIdAndUpdate(
          company,
          {
            $push: { employees: updatedUser._id },
          },
          { new: true }
        );
      }

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Failed to add experience.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Experience added successfully.",
        experience: updatedUser.experience,
      });
    } catch (error) {
      console.error("Error adding experience:", error);
      return res.status(500).json({
        success: false,
        message: "Server error.",
        error: error.message,
      });
    }
  }

  static async addCompanyRating(req, res) {
    try {
      const { company_id } = req.query;
      const { rating, review } = req.body;
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access.",
        });
      }
  
      const { _id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(_id);
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found.",
        });
      }
  
      const hasWorkedForCompany = user.experience.some(
        (exp) => exp.company && exp.company.toString() === company_id
      );
  
      if (!hasWorkedForCompany) {
        return res.status(400).json({
          success: false,
          message: "You are not allowed to review.",
        });
      }
  
      const company = await Company.findById(company_id);
  
      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Company not found.",
        });
      }
  
      const existingReviewIndex = company.reviews.findIndex(
        (r) => r.userId.toString() === _id
      );
  
      if (existingReviewIndex !== -1) {
        company.reviews[existingReviewIndex].rating = rating;
        company.reviews[existingReviewIndex].review = review;
      } else {
        company.reviews.push({ userId: _id, rating, review });
      }
  
      const totalRating = company.reviews.reduce((acc, r) => acc + r.rating, 0);
      company.averageRating = totalRating / company.reviews.length;
  
      await company.save();
  
      return res.status(200).json({
        success: true,
        message: "Review added successfully.",
        data: company,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error.",
      });
    }
  }
  
  static async uploadResume(req,res){
    try {
      if(!req.file){
        return res.status(400).json({
          success: false,
          message: "Please upload a resume file."
        })
      }
      const resume = {
        url: req.file, 
      };
      return res.status(200).json({
        success: true,
        data:resume
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error."
      })
    }
  }
}

export default UserController;
