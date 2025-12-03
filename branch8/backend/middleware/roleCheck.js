module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(403).json({ message: "Access Denied" });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access Denied" });
        }

        next();
    };
};