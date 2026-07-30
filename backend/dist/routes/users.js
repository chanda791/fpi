"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../utils/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
function toSafeUser(user) {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
/**
 * LIST USERS
 */
router.get("/", auth_2.requireAdmin, async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
            orderBy: { createdAt: "asc" },
        });
        res.json(users.map(toSafeUser));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
});
/**
 * CREATE USER
 */
router.post("/", auth_2.requireAdmin, async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Full name, email, and password are required",
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }
        const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({
                message: "A user with this email already exists",
            });
        }
        const user = await prisma_1.prisma.user.create({
            data: {
                fullName,
                email,
                password: (0, auth_1.hashPassword)(password),
                role: role || "editor",
            },
        });
        res.status(201).json(toSafeUser(user));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create user",
        });
    }
});
/**
 * UPDATE USER (name, role, active status)
 */
router.put("/:id", auth_2.requireAdmin, async (req, res) => {
    try {
        const { fullName, role, active } = req.body;
        const user = await prisma_1.prisma.user.update({
            where: { id: Number(req.params.id) },
            data: {
                ...(fullName !== undefined ? { fullName } : {}),
                ...(role !== undefined ? { role } : {}),
                ...(active !== undefined ? { active } : {}),
            },
        });
        res.json(toSafeUser(user));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update user",
        });
    }
});
/**
 * ADMIN RESET OF ANOTHER USER'S PASSWORD
 */
router.post("/:id/reset-password", auth_2.requireAdmin, async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }
        const user = await prisma_1.prisma.user.update({
            where: { id: Number(req.params.id) },
            data: { password: (0, auth_1.hashPassword)(password) },
        });
        res.json({
            message: `Password updated for ${user.email}`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to reset password",
        });
    }
});
/**
 * DELETE USER
 */
router.delete("/:id", auth_2.requireAdmin, async (req, res) => {
    try {
        const targetId = Number(req.params.id);
        if (req.authUser && Number(req.authUser.id) === targetId) {
            return res.status(400).json({
                message: "You cannot delete your own account while signed in as it",
            });
        }
        await prisma_1.prisma.user.delete({
            where: { id: targetId },
        });
        res.json({
            message: "User deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete user",
        });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map