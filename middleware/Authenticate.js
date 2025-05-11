const jwt = require("jsonwebtoken");
const secretKey = "yourSecretKey"; // Store this securely, possibly in environment variables

// Middleware to authenticate the JWT token
const authenticate = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using JWT and the secret key
    const decoded = jwt.verify(token, secretKey);
    
    // Attach the decoded user information to the request object for later use
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Invalid token", error);
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = authenticate;
