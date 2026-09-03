require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/providerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const requestRoutes = require('./routes/requestRoutes')
const reviewRoutes = require('./routes/reviewRoutes');


connectDB();
const app = express();


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port: ${process.env.PORT}`);
});

