const Joi = require("joi");
const { CreateError } = require("../../utils/create_err");
const { trycatch } = require("../../utils/try_catch");
const util = require('util');
const jwt = require('jsonwebtoken')
const signAsync = util.promisify(jwt.sign);

var registration = async (req, res, next, transaction) => {
  const { firstName, lastName, mobile, email, gender, block_id, village_id } = req.body;

  const schema = Joi.object({
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required(),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    email: Joi.string().max(50).required(),
    gender: Joi.string().max(11).required().valid("Male", "Female", "Others"),
    block_id: Joi.number()
      .integer()
      .max(9007199254740991)
      .positive()
      .required(),
      village_id: Joi.number()
      .integer()
      .max(9007199254740991)
      .positive()
      .required(),
  });

  const { error } = await schema.validateAsync(req.body);

  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }


  const existingUser = await transaction("users").where({ mobile }).first();
  if (existingUser) {
    return res
      .status(400)
      .send({ status: 0, message: "This mobile number is already registered" });
  }

  const query = await transaction("users").insert({
    mobile,
    email,
    firstName,
    lastName,
    gender,
    block_id,
    village_id,
    status: 0,
  });

  res.send({ status: '001', message: "users added successfully" });
};

var userLogin = async (req, res, next, transaction) => {
  const { mobile, isOfficial } = req.body;

  const schema = Joi.object({
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    isOfficial:Joi.number().positive().required().valid(0, 1) //1 official, 0 citizen
  });

  const { error } = await schema.validateAsync(req.body);

  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }

  const user = await transaction("users")
      .select("*")
      .where("mobile", mobile)
      .first();
  
    if (!user) {
      res.send({ status: '002', message: "Mobile is not Registered" });
    } else {  
        const payload = {
          id: user.id,
          private_key: process.env.user_key,
          is_official:user.status
        };
        try {
          const token = await signAsync(payload, process.env.secret_key);
          await transaction("users")
            .where({ id: user.id })
            .update({ token: token });
          return res.send({
            status: "001",
            token: token,
            username: user.firstName,
            isOfficial:user.status
          });
        } catch (err) {
          res.send({ status: '002', message: "error occured"});
        }
      
    }
};

var userLogout = async(req,res,next,transaction)=>{
  const update = await transaction("users").update({token:null}).where('id',req.user_id)
  res.send({
    status: "001",
    message:'Logout successfully'
  });
}

registration = trycatch(registration);
userLogin = trycatch(userLogin)
userLogout = trycatch(userLogout)

module.exports = { registration, userLogin, userLogout };
