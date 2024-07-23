import express from 'express'
import CompanyController from '../Controller/employer.Controller.js'
import authorizeRoles from '../Middleware/AuthRole.Middleware.js'
const app= express()

app.post('/register',CompanyController.RegisterCompany)
app.post('/login',CompanyController.LoginCompany)
app.post('/change-password',CompanyController.changePassword)
app.post('/update-profile',CompanyController.updateCompanyProfile)
app.post('/post-job',authorizeRoles,CompanyController.postJob)
app.get("/get-all-jobs",authorizeRoles,CompanyController.getAllJobs)
app.get("/get-all-employees",authorizeRoles,CompanyController.getAllEmployees)
app.post("/review-employee",authorizeRoles,CompanyController.addRatingEmployee)
app.get("/get-all-jobs-Details",CompanyController.getalljobDetails)
app.get("/get-employee-details",authorizeRoles,CompanyController.getEmployeeDetails)


export default app