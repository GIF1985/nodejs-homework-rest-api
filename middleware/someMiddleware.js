// someMiddleware.js
export function someMiddleware(req, res, next) {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);

  const isAuthenticated = true;
  if (!isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}
