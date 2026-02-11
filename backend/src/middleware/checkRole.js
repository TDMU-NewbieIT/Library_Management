/**
 * Middleware to check if the user has one of the required roles
 * @param {string[]} roles - Array of allowed roles (e.g., ['admin', 'librarian'])
 */
module.exports = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Quyền truy cập bị từ chối: Yêu cầu vai trò ${roles.join(' hoặc ')}` 
            });
        }

        next();
    };
};
