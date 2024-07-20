import express from 'express'
import UserController from '../Controller/user.Controller.js'
import upload from '../Middleware/multer.Middleware.js'
const app =express()

app.post('/signup',UserController.registerUser)
app.post('/login',UserController.loginUser)
app.post('/change-password',UserController.changePassword)
app.post('/forgot-password',UserController.forgotPassword)
app.post('/update-profile',UserController.updateUserProfile)
app.get('/apply',UserController.applyJob)
app.post('/add-experience',UserController.addExperience)
app.post('/review-company',UserController.addCompanyRating)
app.post('/upload-resume', upload.single('file'), UserController.uploadResume);

export default app