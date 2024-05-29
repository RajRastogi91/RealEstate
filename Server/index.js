import express from "express";
import cors from "cors";
import path from 'path';
import bodyParser from "body-parser";
import authRouter from './Routes/auth.route.js';
import listingRouter from './Routes/listing.route.js';
import userRouter from './Routes/user.route.js';
import paymentRouter from './Routes/payment.route.js';

const app = express();
app.use(bodyParser.json());

const allowedOrigins = [
  'https://squareproperty.netlify.app',
  'https://665562571f96ed8efcad92e6--squareproperty.netlify.app',// Add other allowed origins here
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.options('*', cors());

// Serve static files from the Vite app's dist directory

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/auth', authRouter);
app.use('/listing', listingRouter);
app.use('/user', userRouter);
app.use('/payment', paymentRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server Started on port ${port}...`));


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
