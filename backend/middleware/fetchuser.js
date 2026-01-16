var jwt=require('jsonwebtoken');

const JWT_tokens="VishalHello";
const fetchuser=(req,res,next)=>
{
    //get the user from the jwt tokens and id to request object

    const token=req.header('auth-token');
     if (!token) {
      return res.status(401).send({ errors: "please authenticate using the valid token" });
    }
    try {
         const data=jwt.verify(token,JWT_tokens);
    req.user=data.user;
    next();
    } catch (error) {
        return res.status(401).send({ errors: "please authenticate using the valid token" });
    }
   
}

module.exports=fetchuser;