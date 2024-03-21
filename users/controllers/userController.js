const Joi = require("joi");
const { CreateError } = require("../../utils/create_err");
const bcrypt = require("bcrypt");
const { trycatch } = require("../../utils/try_catch");
const util = require('util');
const jwt = require('jsonwebtoken')
const signAsync = util.promisify(jwt.sign);

var registration = async (req, res, next, transaction) => {
  const { firstName, lastName, mobile, email, password } = req.body;

  const schema = Joi.object({
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required(),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    email: Joi.string().max(50).required(),
    password: Joi.string().max(50).required(),
  });

  const { error } = await schema.validateAsync(req.body);

  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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
    password: hashedPassword,
    status: 0,
  });

  res.send({ status: 1, message: "users added successfully" });
};

var userLogin = async (req, res, next, transaction) => {
  const { mobile, password } = req.body;

  const schema = Joi.object({
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    password: Joi.string().max(50).required(),
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
      const isMatch = bcrypt.compareSync(password, user.password);
  
      if (isMatch) {
        const payload = {
          id: user.id,
          private_key: process.env.user_key,
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
      } else {
        res.send({ status: '002', message: "Incorrect password" });
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
