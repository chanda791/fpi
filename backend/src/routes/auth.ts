import { Router } from "express";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { signToken, verifyPassword, hashPassword } from "../utils/auth";
import { requireAuth } from "../middleware/auth";
import { sendMail } from "../utils/mailer";
import { loginRateLimit, passwordResetRateLimit } from "../middleware/rateLimit";

const router = Router();

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

router.post("/login", loginRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (envEmail && envPassword && email === envEmail && password === envPassword) {
      return res.json({
        token: signToken({ id: "env-admin", email, role: "admin" }),
        user: {
          email,
          fullName: process.env.ADMIN_NAME || "Administrator",
          role: "admin",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.active || !verifyPassword(password, user.password)) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      token: signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
      user: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

/**
 * FORGOT PASSWORD
 * Always responds with a generic success message, whether or not the email
 * exists, to avoid leaking which addresses have accounts. If SMTP is
 * configured (see Settings), emails a reset link. Otherwise logs the link
 * server-side -- see PASSWORD_RECOVERY.md for the manual procedure.
 */
router.post("/forgot-password", passwordResetRateLimit, async (req, res) => {
  try {
    const { email } = req.body as { email?: string };

    const genericResponse = {
      message:
        "If an account exists for that email, a password reset link has been generated.",
    };

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.active) {
      // Do not reveal whether the account exists.
      return res.json(genericResponse);
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const appUrl = process.env.APP_PUBLIC_URL || process.env.CORS_ORIGIN || "http://localhost:3000";
    const resetLink = `${appUrl.split(",")[0]}/admin/reset-password?token=${token}`;

    const result = await sendMail({
      to: user.email,
      subject: "Reset your FPI Zambia CMS password",
      text: `Hello ${user.fullName},\n\nA password reset was requested for your account. This link expires in 1 hour:\n\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.`,
    });

    if (!result.sent) {
      // SMTP isn't configured -- the link has been logged server-side.
      // See PASSWORD_RECOVERY.md for the manual admin procedure.
      console.log(`[auth] Password reset link for ${user.email}: ${resetLink}`);
    }

    res.json(genericResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to process request" });
  }
});

/**
 * RESET PASSWORD (via emailed/manually-shared token)
 */
router.post("/reset-password", passwordResetRateLimit, async (req, res) => {
  try {
    const { token, password } = req.body as { token?: string; password?: string };

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: "This reset link is invalid or has expired" });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashPassword(password) },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    res.json({ message: "Password has been reset successfully. You can now sign in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to reset password" });
  }
});

/**
 * CHANGE OWN PASSWORD (signed in)
 */
router.put("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    if (!req.authUser || req.authUser.id === "env-admin") {
      return res.status(400).json({
        message:
          "The bootstrap administrator account is managed via environment variables (ADMIN_PASSWORD), not this form.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(req.authUser.id) },
    });

    if (!user || !verifyPassword(currentPassword, user.password)) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashPassword(newPassword) },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to change password" });
  }
});

export default router;
