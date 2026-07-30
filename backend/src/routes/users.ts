import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/auth";
import { requireAdmin } from "../middleware/auth";

const router = Router();

function toSafeUser(user: {
  id: number;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
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
router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.json(users.map(toSafeUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

/**
 * CREATE USER
 */
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body as {
      fullName?: string;
      email?: string;
      password?: string;
      role?: string;
    };

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

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashPassword(password),
        role: role || "editor",
      },
    });

    res.status(201).json(toSafeUser(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

/**
 * UPDATE USER (name, role, active status)
 */
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { fullName, role, active } = req.body as {
      fullName?: string;
      role?: string;
      active?: boolean;
    };

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(fullName !== undefined ? { fullName } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(active !== undefined ? { active } : {}),
      },
    });

    res.json(toSafeUser(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update user",
    });
  }
});

/**
 * ADMIN RESET OF ANOTHER USER'S PASSWORD
 */
router.post("/:id/reset-password", requireAdmin, async (req, res) => {
  try {
    const { password } = req.body as { password?: string };

    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { password: hashPassword(password) },
    });

    res.json({
      message: `Password updated for ${user.email}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to reset password",
    });
  }
});

/**
 * DELETE USER
 */
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    if (req.authUser && Number(req.authUser.id) === targetId) {
      return res.status(400).json({
        message: "You cannot delete your own account while signed in as it",
      });
    }

    await prisma.user.delete({
      where: { id: targetId },
    });

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

export default router;
