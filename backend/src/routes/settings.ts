import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const SENSITIVE_FIELDS = ["smtpPassword"] as const;

function redact(settings: any) {
  if (!settings) return settings;

  const copy = { ...settings };

  for (const field of SENSITIVE_FIELDS) {
    if (copy[field]) {
      copy[field] = "";
      copy[`${field}Set`] = true;
    } else {
      copy[`${field}Set`] = false;
    }
  }

  return copy;
}

/**
 * GET SETTINGS (singleton -- creates a default row on first request)
 */
router.get("/", async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }

    res.json(redact(settings));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch settings",
    });
  }
});

/**
 * UPDATE SETTINGS (singleton)
 */
router.put("/", async (req, res) => {
  try {
    const {
      organisation,
      mission,
      vision,
      email,
      phone,
      address,
      logo,
      favicon,
      facebook,
      twitter,
      instagram,
      youtube,
      linkedin,
      seoTitle,
      seoDescription,
      footerText,
      copyrightText,
      analyticsId,
      maintenanceMode,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpFromEmail,
      smtpFromName,
    } = req.body;

    const data: Record<string, unknown> = {
      organisation,
      mission,
      vision,
      email,
      phone,
      address,
      logo,
      favicon,
      facebook,
      twitter,
      instagram,
      youtube,
      linkedin,
      seoTitle,
      seoDescription,
      footerText,
      copyrightText,
      analyticsId,
      maintenanceMode,
      smtpHost,
      smtpPort: smtpPort === "" || smtpPort === undefined ? undefined : Number(smtpPort),
      smtpUser,
      smtpFromEmail,
      smtpFromName,
    };

    // Only overwrite the stored SMTP password if a new one was actually provided --
    // the frontend never receives the real value back, so a blank field must not
    // wipe out a previously-saved password.
    if (smtpPassword) {
      data.smtpPassword = smtpPassword;
    }

    const existing = await prisma.siteSettings.findFirst();

    const settings = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.siteSettings.create({
          data,
        });

    res.json(redact(settings));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update settings",
    });
  }
});

export default router;
