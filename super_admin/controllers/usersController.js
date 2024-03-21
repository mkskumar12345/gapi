const Joi = require("joi");
const { CreateError } = require("../../utils/create_err");
const { trycatch } = require("../../utils/try_catch");
const bcrypt = require("bcrypt");

var add_citizen = async (req, res, next, transaction) => {
  const { citizen_name, password } = req.body;

  const schema = Joi.object({
    citizen_name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().max(50).required(),
  });

  const { error } = await schema.validateAsync(req.body);

  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await transaction("citizen")
    .where({ citizen_name })
    .first();

  if (existingUser) {
    return res
      .status(400)
      .send({ status: "002", message: "citizen already exists" });
  }

  const query = await transaction("citizen").insert({
    citizen_name,
    password: hashedPassword,
  });

  res.send({ status: "001", message: "Citizen added successfully" });
};

var delete_citizen = async (req, res, next, transaction) => {
  const citizen_id = req.params.citizen_id;

  const existingUser = await transaction("citizen")
    .where('id',citizen_id)
    .first();

    if(!existingUser){
        return res
      .status(400)
      .send({ status: "002", message: "citizen do not exists" });
    }

    await transaction("citizen").delete().where("id", citizen_id);

  
  res.send({ status: "001", message: "Citizen deleted successfully" });
};

add_citizen = trycatch(add_citizen);
delete_citizen = trycatch(delete_citizen);

module.exports = { add_citizen, delete_citizen };
