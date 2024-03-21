const jwt = require("jsonwebtoken");
const knex = require('../../db.js');

const admin_token_val = async (req, res, next) => {
  try {
    let token = req.header("authorization");
    token = token.split(" ");
    if (!token) {
      return res.json({ status: '002', msg: "Please provide token in header" });
    }

    const { id } = jwt.verify(token[1], process.env.admin_key);
    const [Token] = await knex("super_admins").pluck("token").where("id", id);
    if (Token === null) {
      return res.send({
        status: '002',
        message: "Token has been revoked. Please log in again.",
      });
    }

    req.admin_id = id;
    if (Token === token[1]) {
      next();
    } else {
      res.send({ status: '002', message: "You are not the correct user." });
    }
  } catch (error) {
    res.send({ status: '002', msg: "Invalid or expired token" });
  }
};

module.exports = admin_token_val;


