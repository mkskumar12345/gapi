const Joi = require("joi");
const { trycatch } = require("../../utils/try_catch");
const { CreateError } = require("../../utils/create_err");

var addProject = async (req, res, next, transaction) => {
  var data = req.body;

  const schema = Joi.object({
    work_category: Joi.number().valid(0, 1, 2).required(),
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
    start_date: Joi.date().required().allow("").allow(null),
    completion_date: Joi.date().required().allow("").allow(null),
    allotted_cost: Joi.number().min(1).required(),
    estimated_cost: Joi.number().min(1).required(),
    images: Joi.string().max(250).allow(""),
    projectDetails: Joi.string().max(250).required(),
  });

  const { error } = await schema.validateAsync(data);
  if (error) {
    throw new CreateError("ValidationError", error.details[0].message);
  }

  var {
    work_category,
    district_id,
    block_id,
    village_id,
    start_date,
    completion_date,
    allotted_cost,
    estimated_cost,
    projectDetails
  } = req.body;

  const [project_id] = await transaction("projects").insert({
    user_id: req.user_id,
    work_category,
    remarks:projectDetails,
    district_id,
    block_id,
    village_id,
    start_date,
    completion_date,
    allotted_cost,
    estimated_cost,
    project_status:0
  });

  if (!req.files) {
    throw new CreateError("FileUploadError", "upload atleast one image");
  }

  const imageFiles = req.files;
  
    for (let i = 1; i <= 4 && i < imageFiles.length; i++) {
      const photoField = `photo${i}`;
      await transaction("projects")
        .where("id", project_id)
        .update({ [photoField]: imageFiles[i].filename });
    }
  

  res
    .status(200)
    .json({ status: "002", message: "Project submitted successfully" });
};

var show_no_of_project = async (req, res, next, transaction) => {
    const counts = await transaction("projects")
      .select("project_status")
      .count("id as count")
      .groupBy("project_status");
  
    // Prepare response
    const projectCounts = {
      pending: 0,
      closed: 0,
      rejected: 0,
    };
  
    // Update response with counts
    counts.forEach((item) => {
      switch (item.project_status) {
        case 0:
          projectCounts.pending = item.count;
          break;
        case 1:
          projectCounts.closed = item.count;
          break;
        case 2:
          projectCounts.rejected = item.count;
          break;
      }
    });
  
    // Calculate total count
    projectCounts.total =
      projectCounts.pending + projectCounts.closed + projectCounts.rejected;
  
    res.status(200).json({ status: "001", projectCounts });
  };


  var show_all_projects = async (req, res, next, transaction) => {
    const projects = await transaction("projects").select("*");
    res.status(200).json({ status: "001", projects });
  };
  
  var projects_by_type = async(req,res,next,transaction)=>{
  
    const { project_status } = req.body;
    const schema = Joi.object({
        project_status: Joi.number().positive().required().valid(0, 1, 2), // 0 pending, 1 completed 2 rejected
    });
  
    const { error } = await schema.validateAsync(req.body);
    if (error) {
      throw new CreateError("ValidationError", error.details[0].message);
    }
  
  
    switch (project_status) {
      case 0:
        var projects = await transaction('projects').select('*').where('project_status',0)
          break;
      case 1:
        var projects = await transaction('projects').select('*').where('project_status',1)
          break;
      case 2:
        var projects = await transaction('projects').select('*').where('project_status',2)
          break;
      default:
          res.status(400).send('Bad Request: Invalid type');
  }
  
  if(projects.length==0){
    res.json({status:'002', msg:"No projects"});
  }
  
    res.status(200).json({status:'001',projects});
  }
  
  var view_projects_by_id = async(req,res,next,transaction)=>{
  
    const {project_id} = req.body;
    const schema = Joi.object({
        project_id: Joi.number()
      .integer()
      .max(9007199254740991)
      .positive()
      .required(),
    });
  
    const { error } = await schema.validateAsync(req.body);
    if (error) {
      throw new CreateError("ValidationError", error.details[0].message);
    }
    const project = await transaction("projects").select("*").where("id",project_id)
    if(!project){
      return res.send({status:'002',msg:"No record found"})
    }
    res.status(200).json({status:'001',project});
  }

addProject = trycatch(addProject);
show_no_of_project = trycatch(show_no_of_project);
show_all_projects = trycatch(show_all_projects);
projects_by_type = trycatch(projects_by_type);
view_projects_by_id = trycatch(view_projects_by_id);


module.exports = {addProject, show_no_of_project, show_all_projects, projects_by_type, view_projects_by_id}
