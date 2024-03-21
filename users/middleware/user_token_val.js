const jwt = require("jsonwebtoken");
const util = require("util");
const { CreateError } = require("../../utils/create_err");
const { trycatch } = require("../../utils/try_catch");

const verifyJwt = util.promisify(jwt.verify);

// var citizen_tokenval = async (req, res, next,transaction) => {
//     const token = req.header('authorization');
//     const tokenParts = token ? token.split(" ") : [];
  
//     if (!tokenParts[1]) {
//       throw new CreateError("TokenError","Header is Empty")
//     }


//     try {
//         const decoded = await verifyJwt(tokenParts[1], process.env.secret_key);

//         if(decoded.private_key !== process.env.citizen_key){
//           throw new CreateError("TokenError","Token is Valid But Not Having secret key Of Citizen ")
//         }
//         req.citizen_id = decoded.id;
//         var {token:comp_token}=await transaction("users").select("token").where({ id: decoded.id }).andWhere('status',0).first();
//         if(tokenParts[1]!==comp_token){
//             throw new CreateError("TokenError","Invalid Token")
//         }

//         next();
//       } catch (error) {
//         throw new CreateError("TokenError","Invalid Token")
//       }


// }


var user_tokenval = async (req, res, next,transaction) => {
  const token = req.header('authorization');
  const tokenParts = token ? token.split(" ") : [];

  if (!tokenParts[1]) {
    throw new CreateError("TokenError","Header is Empty")
  }

  //var { isOfficial } = req.body;

 // isOfficial = parseInt(isOfficial);



  try {
      const decoded = await verifyJwt(tokenParts[1], process.env.secret_key);

      if(decoded.private_key !== process.env.user_key){
        throw new CreateError("TokenError","Token is Valid But Not Having secret key Of User ")
      }
      req.user_id = decoded.id;
      var {token:db_token}=await transaction("users").select("token").where({ id: decoded.id }).andWhere('status',decoded.is_official).first();
      if(tokenParts[1]!==db_token){
          throw new CreateError("TokenError","Invalid Token")
      }

      next();
    } catch (error) {
      throw new CreateError("TokenError","Invalid Token")
    }


}

user_tokenval=trycatch(user_tokenval)

module.exports={user_tokenval}
  