const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authMiddleware = async (req, res, next) => {
  // 1. Get token from headers or cookies
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // 2. Check token exists
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  // 3. Verify token
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 4. Check if user still exists (optional)
    // const currentUser = await User.findById(decoded.id);
    // if (!currentUser) {
    //   return res.status(401).json({
    //     status: 'fail',
    //     message: 'The user belonging to this token no longer exists.'
    //   });
    // }

    // 5. Grant access
    req.user = decoded;
    res.locals.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token! Please log in again.'
    });
  }
};

// Optional: Role-based authorization
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = { authMiddleware, restrictTo };