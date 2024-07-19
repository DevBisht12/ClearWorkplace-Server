import express from 'express';
import userRoutes from './Routes/userRoutes.js';
import employerRoutes from './Routes/employerRoutes.js';
import ConnectDB from './DataBase/Config/connectDB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  }));


app.use(express.json());
app.use(cookieParser());


// {
//     origin: 'http://localhost:5173',
//     credentials: true,
// }

// Connect to database
ConnectDB(DATABASE_URL)
    .then(() => {
        console.log('Connected to Database 🚀');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1); 
    });

    app.get('/',(req,res)=>{
        res.send('Clear-Workplace-Server Working Fine..');
    })
// User or employee routes
app.use('/user', userRoutes);
// Company or employer routes
app.use('/employer', employerRoutes);

app.get('/', (req, res) => {
    res.send("<h1>Testing ClearWorkSpace....</h1>");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
