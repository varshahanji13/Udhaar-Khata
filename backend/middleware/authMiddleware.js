import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // Ignore browser favicon request
    if(req.path === "/favicon.ico"){
      return next();
    }

    console.log("Token:", authHeader);

    if(
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ){
      return res.status(401).json({
        message:"Unauthorized access"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch(error){

    console.log(error);

    res.status(401).json({
      message:"Invalid token"
    });

  }
};

export default authMiddleware;