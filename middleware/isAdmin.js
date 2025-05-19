const isAdmin = (req, res, next) => {
    // Check if the user is authenticated and has the isAdmin property
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next(); // Proceed to the next middleware or controller
  };
  
  module.exports = isAdmin;