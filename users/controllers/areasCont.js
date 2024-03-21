const Joi = require("joi");
const { CreateError } = require("../../utils/create_err");
const { trycatch } = require("../../utils/try_catch");

var get_villages_by_blockId = async(req,res,next,transaction)=>{

    const {block_id} = req.body

    const schema = Joi.object({
        block_id: Joi.number()
        .integer()
        .max(9007199254740991)
        .positive()
        .required(),
      });
    
      const { error } = await schema.validateAsync(req.body);
      if (error) {
        throw new CreateError("ValidationError", error.details[0].message);
      }

  const villages = await transaction("villages").select("id", "villageName").where("block_id", block_id)
  res.send({ status: "001", villages});
}


var get_blocks = async(req,res,next,transaction)=>{
    const blocks = await transaction("blocks").select("id", "blockName")
  res.send({ status: "001", blocks});
}


get_villages_by_blockId = trycatch(get_villages_by_blockId)
get_blocks = trycatch(get_blocks)

module.exports = {get_villages_by_blockId, get_blocks}


