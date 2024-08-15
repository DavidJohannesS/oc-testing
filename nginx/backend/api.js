const express = require('express');
const app=express();
const port=3000;
const cors=require('cors');
const userRoutes=require('./routes/userRoutes');
const quizRoutes=require('./routes/quizRoutes');
console.log(userRoutes);
console.log(quizRoutes);
app.use(express.json());
app.use(cors());
app.use('/users',userRoutes);
app.use('/quiz',quizRoutes);
app.listen(port, ()=>{
      console.log(`Server is running at http://192.168.0.22:${port}`);
});

