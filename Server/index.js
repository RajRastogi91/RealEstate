import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from './Routes/auth.route.js';
import listingRouter from './Routes/listing.route.js';
import userRouter from './Routes/user.route.js';
import paymentRouter from './Routes/payment.route.js';
import path from 'path';


const __dirname = path.resolve();


const app = express();
app.use(bodyParser.json());
app.use(cors())


const port = process.env.PORT;
app.listen(port, () => console.log(`Server Started on port ${port}...`));




app.use('/auth', authRouter);
app.use('/listing', listingRouter);
app.use('/user', userRouter);
app.use('/payment', paymentRouter);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

