import jwt from "jsonwebtoken";


export const generateAccessToken = (user) => {
  const payload = {
    uid: user.uid,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; 
    console.log("User from token:", req.user);
    console.log("UID:", req.user?.uid);
    next();
  });
};
