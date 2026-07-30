"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAuthForMutations = requireAuthForMutations;
exports.requireAdmin = requireAdmin;
const auth_1 = require("../utils/auth");
function requireAuth(req, res, next) {
    const authHeader = req.header("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const payload = token ? (0, auth_1.verifyToken)(token) : null;
    if (!token || !payload) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }
    req.authUser = payload;
    next();
}
function requireAuthForMutations(req, res, next) {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
        return next();
    }
    return requireAuth(req, res, next);
}
/**
 * Restricts a route to admin-role accounts (Super Admin / Admin).
 * Must run after requireAuth (or requireAuthForMutations for a mutation),
 * since it depends on req.authUser being populated.
 */
function requireAdmin(req, res, next) {
    const authHeader = req.header("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const payload = token ? (0, auth_1.verifyToken)(token) : null;
    if (!token || !payload) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }
    req.authUser = payload;
    if (payload.role !== "admin" && payload.role !== "superadmin") {
        return res.status(403).json({
            message: "Administrator access required",
        });
    }
    next();
}
//# sourceMappingURL=auth.js.map