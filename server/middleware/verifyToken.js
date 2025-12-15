const jwt = require("jsonwebtoken");



// (Level 1: The ID Check)  Authentication (Who are you?)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Removes "Bearer "
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// verifyTokenAndAuthorization (Level 2: The Ownership Check)

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    // Allow if user is an Admin OR if the user ID matches the requested ID
    // req.params.userId ----> order.js  different routes gives user id in different way iske lie aisa kia tha
    if (req.user.id === req.params.id || req.user.id === req.params.userId || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};


// verifyTokenAndAdmin (Level 3: The VIP Check) Admin Authorization (Are you the Boss?)

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

// Export ALL THREE functions
module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};