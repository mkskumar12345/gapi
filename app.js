const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoute = require('./super_admin/routes/adminRoute');
const userRoute = require('./users/routes/userRoute');

const usersRoute = require('./super_admin/routes/usersRoute');
const grievanceRoute = require('./users/routes/grievanceRoute');
const districtRoute = require('./super_admin/routes/districtRoute');
const villageRoute = require('./super_admin/routes/villageRoute');
const blockRoute = require('./super_admin/routes/blockRoute');
const projectRoute = require('./users/routes/projectRoute');
const areasRoute = require('./users/routes/areasRoute');
require('dotenv').config();



app.use(cors());

// Set up body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//routes for admin
app.use(adminRoute);
app.use(usersRoute);
app.use(districtRoute);
app.use(villageRoute);
app.use(blockRoute);

//route for users
app.use(userRoute);
app.use(grievanceRoute);
app.use(projectRoute);
app.use(areasRoute);


app.get("/check",(req,res)=>res.send({msg:"Super Admin is working"}))


app.listen(process.env.port,()=>{
    console.log(`server is running on port ${process.env.port}`);
})