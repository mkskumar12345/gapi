const Joi = require("joi");
const { trycatch } = require("../../utils/try_catch");
const { CreateError } = require("../../utils/create_err");

var addGrievance = async (req, res, next, transaction) => {
  var data = req.body;

  const schema = Joi.object({
    grievance_type: Joi.number().valid(0, 1, 2).required(),
    grievanceDetails: Joi.string().max(250).required(),
    is_similar_grievance: Joi.number().valid(0, 1).required(),
    district_id: Joi.number()
      .integer()
      .max(9007199254740991)
      .positive()
      .required(),
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
    address: Joi.string().max(250).required(),
    images: Joi.string().max(250).allow(""),
  });

  const { error } = await schema.validateAsync(data);
  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }


  var {
    grievance_type,
    grievanceDetails,
    is_similar_grievance,
    district_id,
    block_id,
    village_id,
    address,
  } = req.body;

  const [grievance_id] = await transaction("grievances").insert({
    user_id: req.user_id,
    type: grievance_type,
    grievance_details: grievanceDetails,
    address_details: address,
    district_id,
    block_id,
    village_id,
    grievance_status: 0,
    is_similar_grievance,
  });

  const imageFiles = req.files;
  if (imageFiles) {
    for (let i = 0; i < 4 && i < imageFiles.length; i++) {
      const photoField = `photo${i + 1}`;
      await transaction("grievances")
        .where("id", grievance_id)
        .update({ [photoField]: imageFiles[i].filename });
    }
  }

  res
    .status(200)
    .json({ status: "002", message: "Grievance submitted successfully" });
};

var show_no_of_grievances = async (req, res, next, transaction) => {
  const counts = await transaction("grievances")
    .select("grievance_status")
    .count("id as count")
    .groupBy("grievance_status");

  // Prepare response
  const grievanceCounts = {
    pending: 0,
    closed: 0,
    rejected: 0,
  };

  // Update response with counts
  counts.forEach((item) => {
    switch (item.grievance_status) {
      case 0:
        grievanceCounts.pending = item.count;
        break;
      case 1:
        grievanceCounts.closed = item.count;
        break;
      case 2:
        grievanceCounts.rejected = item.count;
        break;
    }
  });

  // Calculate total count
  grievanceCounts.total =
    grievanceCounts.pending + grievanceCounts.closed + grievanceCounts.rejected;

  res.status(200).json({ status: "001", grievanceCounts });
};

var show_all_grievances = async (req, res, next, transaction) => {
  const grievances = await transaction("grievances").select("*");
  res.status(200).json({ status: "001", grievances });
};

var grievances_by_type = async(req,res,next,transaction)=>{

  const { type } = req.body;
  const schema = Joi.object({
    type: Joi.number().positive().required().valid(0, 1, 2), // 0 pending, 1 closed 2 rejected
  });

  const { error } = await schema.validateAsync(req.body);
  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }


  switch (type) {
    case 0:
      var grievances = await transaction('grievances').select('*').where('grievance_status',0)
        break;
    case 1:
      var grievances = await transaction('grievances').select('*').where('grievance_status',1)
        break;
    case 2:
      var grievances = await transaction('grievances').select('*').where('grievance_status',2)
        break;
    default:
        res.status(400).send('Bad Request: Invalid type');
}

if(grievances.length==0){
  res.json({status:'002', msg:"No grievances"});
}

  res.status(200).json({status:'001',grievances});
}

var view_grievance_by_id = async(req,res,next,transaction)=>{

  const {grievance_id} = req.body;
  const schema = Joi.object({
    grievance_id: Joi.number()
    .integer()
    .max(9007199254740991)
    .positive()
    .required(),
  });

  const { error } = await schema.validateAsync(req.body);
  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }
  const grievance = await transaction("grievances").select("*").where("id",grievance_id)
  if(!grievance){
    return res.send({status:'002',msg:"No record found"})
  }
  res.status(200).json({status:'001',grievance});
}

// var closed_grievances = async(req,res,next,transaction)=>{
//   const grievances = await transaction('grievances').select('*').where('grievance_status',1)
//   res.status(200).json({status:'001',grievances});
// }

// var rejected_grievances = async(req,res,next,transaction)=>{
//   const grievances = await transaction('grievances').select('*').where('grievance_status',2)
//   res.status(200).json({status:'001',grievances});
// }

addGrievance = trycatch(addGrievance);
show_no_of_grievances = trycatch(show_no_of_grievances);
show_all_grievances = trycatch(show_all_grievances);
grievances_by_type = trycatch(grievances_by_type);
view_grievance_by_id = trycatch(view_grievance_by_id);
// closed_grievances = trycatch(closed_grievances);
// rejected_grievances = trycatch(rejected_grievances);

module.exports = { addGrievance, show_no_of_grievances, show_all_grievances , grievances_by_type, view_grievance_by_id};
