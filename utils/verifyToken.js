const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "You're Not Authorize" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Token Is Invalid" });
    }
    req.user = user;
    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || !req.user.id || !req.user.role) {
      return res
        .status(403)
        .json({ success: false, message: "User details are missing" });
    }

    if (req.user.id === req.params.userId || req.user.role === "admin") {
      return next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You're Not Authenticated" });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "You're Not Authorized" });
    }
  });
};

const verifyCompany = (req, res, next) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  console.log("Token from cookies or headers:", token); // Check if token is extracted
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Verified token:", verified); // Log the verified token for debugging
    req.companyId = verified.id;
    next();
  } catch (err) {
    console.error("Token verification error:", err); // Log errors for investigation
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyCompany,
};
