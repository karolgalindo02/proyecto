function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: se requiere rol ${role}`
      });
    }
  };
}

module.exports = authorizeRole;