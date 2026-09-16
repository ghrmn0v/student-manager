import express from "express";
import cors from 'cors';
import studentsRouter from './routes/students'
import type { ErrorRequestHandler } from 'express'

const app = express();
const PORT = 3000;
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error('Server error:', err)
    res.status(500).json({ message: 'Internal Server Error' })
}

app.use(cors());
app.use(express.json());
app.use('/api/students', studentsRouter);
app.use(errorHandler); 


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} port`)
})