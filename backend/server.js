import express from 'express';
import cors from 'cors';
import path from 'path';
import task from './routes/task.js';
import logger from './middleware/logger.js';
import error from './middleware/errorhandling.js';
const app=express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api/task",task);
app.use(error);
app.listen(PORT,()=>console.log(`the server is running at http://localhost:${PORT}`));

