import { useEffect, useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import PrimaryButton from "../../components/admin/PrimaryButton";
import ImageUpload from "../../components/admin/ImageUpload";
import Loading from "../../components/admin/Loading";

import { settingsService, SiteSettings } from "../../services/settingsService";
import { changePassword } from "../../services/auth";

const emptySettings: SiteSettings = {
  id: 0,
  organisation: "Free Press Initiative Zambia",
  mission: "",
  vision: "",
  email: "",
  phone: "",
  address: "",
  logo: "",
  favicon: "",
  facebook: "",
  twitter: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  seoTitle: "",
  seoDescription: "",
  footerText: "",
  copyrightText: "",
  analyticsId: "",
  maintenanceMode: false,
  smtpHost: "",
  smtpPort: undefined,
  smtpUser: "",
  smtpFromEmail: "",
  smtpFromName: "",
  smtpPasswordSet: false,
};

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [form, setForm] = useState<SiteSettings>(emptySettings);
  const [smtpPassword, setSmtpPassword] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await settingsService.get();
        setForm(data);
      } catch (error) {
        console.error(error);
        alert("Unable to load settings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const update = (field: keyof SiteSettings, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveSection = async (fields: (keyof SiteSettings)[]) => {
    try {
      setSaving(true);

      const payload: Record<string, unknown> = {};
      fields.forEach((field) => {
        payload[field] = form[field];
      });

      if (fields.includes("smtpHost") && smtpPassword) {
        payload.smtpPassword = smtpPassword;
      }

      const updated = await settingsService.update(payload);
      setForm(updated);
      setSmtpPassword("");

      alert("Settings saved successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const submitPasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }

    try {
      setSavingPassword(true);

      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);

      alert("Password updated successfully.");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      alert(
        "Unable to change password. Check your current password and try again."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <PageHeader
        title="Settings"
        subtitle="Manage organisation information, branding, SEO, and system settings"
      />

      <div className="grid lg:grid-cols-2 gap-6">

        <PageCard title="Organisation Details">
          <div className="space-y-5">
            <Input
              label="Organisation Name"
              name="organisation"
              value={form.organisation}
              onChange={(e) => update("organisation", e.target.value)}
            />

            <TextArea
              label="Mission"
              name="mission"
              rows={3}
              value={form.mission || ""}
              onChange={(e) => update("mission", e.target.value)}
            />

            <TextArea
              label="Vision"
              name="vision"
              rows={3}
              value={form.vision || ""}
              onChange={(e) => update("vision", e.target.value)}
            />

            <Input
              label="Email"
              name="email"
              value={form.email || ""}
              onChange={(e) => update("email", e.target.value)}
            />

            <Input
              label="Phone"
              name="phone"
              value={form.phone || ""}
              onChange={(e) => update("phone", e.target.value)}
            />

            <Input
              label="Address"
              name="address"
              value={form.address || ""}
              onChange={(e) => update("address", e.target.value)}
            />

            <PrimaryButton
              onClick={() =>
                saveSection([
                  "organisation",
                  "mission",
                  "vision",
                  "email",
                  "phone",
                  "address",
                ])
              }
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Organisation Details"}
            </PrimaryButton>
          </div>
        </PageCard>

        <PageCard title="Branding">
          <div className="space-y-5">
            <ImageUpload
              label="Logo"
              value={form.logo}
              onChange={(v: any) => update("logo", v)}
            />

            <ImageUpload
              label="Favicon"
              value={form.favicon}
              onChange={(v: any) => update("favicon", v)}
            />

            <PrimaryButton
              onClick={() => saveSection(["logo", "favicon"])}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Branding"}
            </PrimaryButton>
          </div>
        </PageCard>

        <PageCard title="Social Media">
          <div className="space-y-5">
            <Input
              label="Facebook"
              name="facebook"
              value={form.facebook || ""}
              onChange={(e) => update("facebook", e.target.value)}
            />

            <Input
              label="Twitter / X"
              name="twitter"
              value={form.twitter || ""}
              onChange={(e) => update("twitter", e.target.value)}
            />

            <Input
              label="Instagram"
              name="instagram"
              value={form.instagram || ""}
              onChange={(e) => update("instagram", e.target.value)}
            />

            <Input
              label="YouTube"
              name="youtube"
              value={form.youtube || ""}
              onChange={(e) => update("youtube", e.target.value)}
            />

            <Input
              label="LinkedIn"
              name="linkedin"
              value={form.linkedin || ""}
              onChange={(e) => update("linkedin", e.target.value)}
            />

            <PrimaryButton
              onClick={() =>
                saveSection(["facebook", "twitter", "instagram", "youtube", "linkedin"])
              }
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Social Links"}
            </PrimaryButton>
          </div>
        </PageCard>

        <PageCard title="SEO & Footer">
          <div className="space-y-5">
            <Input
              label="SEO Title"
              name="seoTitle"
              value={form.seoTitle || ""}
              onChange={(e) => update("seoTitle", e.target.value)}
            />

            <TextArea
              label="SEO Description"
              name="seoDescription"
              rows={3}
              value={form.seoDescription || ""}
              onChange={(e) => update("seoDescription", e.target.value)}
            />

            <TextArea
              label="Footer Text"
              name="footerText"
              rows={2}
              value={form.footerText || ""}
              onChange={(e) => update("footerText", e.target.value)}
            />

            <Input
              label="Copyright Text"
              name="copyrightText"
              value={form.copyrightText || ""}
              onChange={(e) => update("copyrightText", e.target.value)}
            />

            <Input
              label="Analytics ID (e.g. Google Analytics)"
              name="analyticsId"
              value={form.analyticsId || ""}
              onChange={(e) => update("analyticsId", e.target.value)}
            />

            <PrimaryButton
              onClick={() =>
                saveSection([
                  "seoTitle",
                  "seoDescription",
                  "footerText",
                  "copyrightText",
                  "analyticsId",
                ])
              }
              disabled={saving}
            >
              {saving ? "Saving..." : "Save SEO & Footer"}
            </PrimaryButton>
          </div>
        </PageCard>

        <PageCard title="Maintenance Mode">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <input
                id="maintenanceMode"
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => update("maintenanceMode", e.target.checked)}
              />
              <label htmlFor="maintenanceMode">
                Put the public website into maintenance mode
              </label>
            </div>

            <p className="text-sm text-slate-500">
              When enabled, the public site should display a maintenance
              notice instead of normal content. (Enforcing this on the public
              site is a follow-up integration step -- this flag is now saved
              and readable via <code>GET /api/settings</code>.)
            </p>

            <PrimaryButton
              onClick={() => saveSection(["maintenanceMode"])}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Maintenance Mode"}
            </PrimaryButton>
          </div>
        </PageCard>

        <PageCard title="SMTP (Email) Settings">
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Configure SMTP to enable password reset emails. If left blank,
              reset links are logged on the server for manual retrieval --
              see PASSWORD_RECOVERY.md.
            </p>

            <Input
              label="SMTP Host"
              name="smtpHost"
              value={form.smtpHost || ""}
              onChange={(e) => update("smtpHost", e.target.value)}
            />

            <Input
              label="SMTP Port"
              name="smtpPort"
              type="number"
              value={form.smtpPort ?? ""}
              onChange={(e) => update("smtpPort", Number(e.target.value))}
            />

            <Input
              label="SMTP Username"
              name="smtpUser"
              value={form.smtpUser || ""}
              onChange={(e) => update("smtpUser", e.target.value)}
            />

            <Input
              label={
                form.smtpPasswordSet
                  ? "SMTP Password (currently set -- leave blank to keep)"
                  : "SMTP Password"
              }
              name="smtpPassword"
              type="password"
              value={smtpPassword}
              onChange={(e) => setSmtpPassword(e.target.value)}
            />

            <Input
              label="From Email"
              name="smtpFromEmail"
              value={form.smtpFromEmail || ""}
              onChange={(e) => update("smtpFromEmail", e.target.value)}
            />

            <Input
              label="From Name"
              name="smtpFromName"
              value={form.smtpFromName || ""}
              onChange={(e) => update("smtpFromName", e.target.value)}
            />

            <PrimaryButton
              onClick={() =>
                saveSection([
                  "smtpHost",
                  "smtpPort",
                  "smtpUser",
                  "smtpFromEmail",
                  "smtpFromName",
                ])
              }
              disabled={saving}
            >
              {saving ? "Saving..." : "Save SMTP Settings"}
            </PrimaryButton>
          </div>
        </PageCard>

      </div>

      <div className="mt-6">
        <PageCard title="Change My Password">
          <div className="grid md:grid-cols-3 gap-5">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </div>

          <div className="mt-6">
            <PrimaryButton onClick={submitPasswordChange} disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Change Password"}
            </PrimaryButton>
          </div>
        </PageCard>
      </div>

    </AdminLayout>
  );
};

export default Settings;
