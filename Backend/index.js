const express = require('express');
const cors = require('cors');
require('dotenv').config();
const actorsRouter = require('./routes/actors.js');
const schemaRouter = require('./routes/schema.js');
const executeRouter = require('./routes/execute.js');


const app = express();
const PORT = process.env.PORT || 5000;



// Middlewares ..........
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));



// Routes ..................
app.use('/api/actors', actorsRouter);
app.use('/api/schema', schemaRouter);
app.use('/api/execute', executeRouter);



app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Backend API Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});



app.listen(PORT, () => {
  console.log(`Server started successfully at the port ${PORT}`); 
});