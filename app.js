const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoute = require('./super_admin/routes/adminRoute');
const userRoute = require('./users/routes/userRoute');

const usersRoute = require('./super_admin/routes/usersRoute');
const grievanceRoute = require('./users/routes/grievanceRoute');
require('dotenv').config();



app.use(cors());

// Set up body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//routes for admin
app.use(adminRoute);
app.use(usersRoute);

//route for users
app.use(userRoute);
app.use(grievanceRoute);


app.get("/check",(req,res)=>res.send({msg:"Super Admin is working"}))


app.listen(process.env.port,()=>{
    console.log(`server is running on port ${process.env.port}`);
})