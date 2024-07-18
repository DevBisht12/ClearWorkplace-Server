import { Company } from "../DataBase/Modals/employerModal.js";
import { User } from "../DataBase/Modals/userModal.js";
import Job from "../DataBase/Modals/JobModal.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;


class CompanyController {
  static async RegisterCompany(req, res) {
    try {
      const {
        companyName,
        companyEmail,
        companyNumber,
        password,
        companySize,
        aboutCompany,
        profilePicture,
        CoverPicture,
      } = req.body;
      console.log(companyNumber, companyEmail);

      if (
        !companyName ||
        !companyEmail ||
        !companyNumber ||
        !password ||
        !companySize ||
        !aboutCompany
      ) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the required fields",
        });
      }

      const companyExist = await Company.findOne({ companyEmail });
      if (companyExist) {
        return res.status(400).json({
          success: false,
          message: "Company already exists. Please login.",
        });
      }

      const registerCompany = await Company.create({
        companyName,
        companyEmail,
        companyNumber,
        password,
        companySize,
        aboutCompany,
        profilePicture,
        CoverPicture,
      });

      return res.status(200).json({
        success: true,
        message: "Company registered successfully",
        data: registerCompany,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async LoginCompany(req, res) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the required fields",
        });
      }
      const company = await Company.findOne({ companyEmail: email });
      console.log(company);
      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Company does not exist",
        });
      }

      if (password !== company.password) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          id: company._id,
          name: company.companyName,
          email: company.companyEmail,
        },
        JWT_SECRET,
        { expiresIn: "48h" }
      );

      return res.status(200).json({
        success: true,
        message: "Company logged in successfully",
        data: company,
        uid: token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const token = req.headers.authorization;
      if (!token || !oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const { id } = jwt.verify(token, JWT_SECRET);
      const company = await Company.findById(id).select("password");

      if (company.password !== oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      company.password = newPassword;
      await company.save();
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

  static async updateCompanyProfile(req, res) {
    try {
      const token = req.headers.authorization;
      const {
        companySize,
        aboutCompany,
        profilePicture,
        CoverPicture
      } = req.body;


      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { id } = jwt.verify(token, JWT_SECRET);
      console.log("id",id)
      const UpdateCompanyProfile = await Company.findByIdAndUpdate(
        id,
        {
          companySize,
          aboutCompany,
          profilePicture,
          CoverPicture
        },
        { new: true }
      );
      console.log(UpdateCompanyProfile)
      if (!UpdateCompanyProfile) {
        return res.status(404).json({
          success: false,
          message: "Failed to update profile"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        data: UpdateCompanyProfile,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async postJob(req, res) {
    try {
      const company = req.company;

      const { jobTitle, Location, City, Area, pincode, address, jobType, Pay, jobDescription, email } = req.body;

      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Not found!",
        });
      }
      if (!jobTitle || !Location || !City || !Area || !pincode || !address || !jobType || !Pay || !jobDescription || !email) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }

      const newJob = await Job.create({
        jobTitle,
        Location,
        City,
        Area,
        pincode,
        address,
        jobType,
        Pay,
        jobDescription,
        email,
        postedBy: company.id
      });

      if (!newJob) {
        return res.status(400).json({
          success: false,
          message: "Unable to post job",
        });
      }

      company.jobs.push(newJob._id);
      await company.save();

      return res.status(200).json({
        success: true,
        message: "Job posted successfully",
      });


      
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Duplicate email error",
          error: "A job with this email already exists.",
        });
      }
      return res.status(500).json({
        success: false,
        message: "An error occurred while posting the job",
        error: error.message,
      });
    }
  }

  static async getAllJobs(req, res) {
    try {
      // const jobs = await Job.find();
      const company= req.company.jobs
      // console.log(company)
      return res.status(200).json({
        success: true,
        message: "Jobs retrieved successfully",
        data: company,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving jobs",
        error: error.message,
      });
    }
  }

  static async getAllEmployees(req,res){
    try {
      const company= req.company
      console.log(company)
      if(!company){
        return res.status(400).json({
          success: false,
          message:"Data not found"
        })
      }

      const{employees}=company
      return res.status(200).json({
        success:true,
        message:"Employees retrieved successfully",
        data:employees
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message:"Internal server error"
      })
    }
  }

  static async addRatingEmployee(req, res) {
    try {
      const { company } = req;  
      const { rating, review } = req.body;
      const { employee_id } = req.query;
  
      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Company data not found",
        });
      }
      console.log('Company:'.company)
      console.log('Employee_id:'.employee_id)
      const { employees } = company;
  
      if (!employees || employees.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No employees found in the company",
        });
      }
  
      const employee = employees.find(employee => employee._id.toString() === employee_id);
  
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: "Sorry, you cannot rate this user",
        });
      }
  
      const user = await User.findById(employee_id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
  
      // Check if the company has already reviewed the employee
      const existingReviewIndex = user.reviews.findIndex(
        review => review.company.toString() === company._id.toString()
      );
  
      if (existingReviewIndex !== -1) {
        // Update the existing review
        user.reviews[existingReviewIndex].rating = rating;
        user.reviews[existingReviewIndex].review = review;
      } else {
        // Add a new review
        user.reviews.push({ company: company._id, rating, review: review });
      }
  
      // Calculate the new average rating
      const totalRatings = user.reviews.reduce((sum, review) => sum + review.rating, 0);
      user.averageRating = totalRatings / user.reviews.length;
  
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Rating updated successfully",
        employee: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
  
}

export default CompanyController;
