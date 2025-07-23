import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import doctorsRouter from './routes/doctors.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(` MongoDB connected ${process.env.MONGO_URI}`))

  .catch(err => console.error(err));

app.use('/api/doctors', doctorsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
