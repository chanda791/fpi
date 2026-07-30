import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import ImageUpload from "../../components/admin/ImageUpload";
import PrimaryButton from "../../components/admin/PrimaryButton";
import SecondaryButton from "../../components/admin/SecondaryButton";
import Loading from "../../components/admin/Loading";
import { API_BASE_URL } from "../../services/config";

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    position: "",
    category: "",
    biography: "",
    image: "",
    responsibilities: "",
    displayOrder: 0,
    published: true,
  });

  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/team/${id}`);
        const data = await res.json();

        setForm({
          fullName: data.fullName || "",
          position: data.position || "",
          category: data.category || "",
          biography: data.biography || "",
          image: data.image || "",
          responsibilities: Array.isArray(data.responsibilities)
            ? data.responsibilities.join("\n")
            : "",
          displayOrder: data.displayOrder ?? 0,
          published: data.published ?? true,
        });
      } catch (err) {
        console.error(err);
        alert("Unable to load team member.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      fullName: form.fullName,
      position: form.position,
      category: form.category,
      biography: form.biography,
      image: form.image,
      responsibilities: form.responsibilities
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      displayOrder: form.displayOrder,
      published: form.published,
    };

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      navigate("/admin/team");
    } catch (error) {
      console.error(error);
      alert("Failed to update team member.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>

      <PageHeader
        title="Edit Team Member"
        subtitle="Update team member details"
        backTo="/admin/team"
      />

      <PageCard>

        {loading ? (
          <Loading />
        ) : (

          <form onSubmit={submit} className="space-y-6">

            <Input
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />

            <Input
              label="Position"
              name="position"
              value={form.position}
              onChange={(e) => update("position", e.target.value)}
            />

            <Input
              label="Category"
              name="category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            />

            <TextArea
              label="Biography"
              name="biography"
              rows={6}
              value={form.biography}
              onChange={(e) => update("biography", e.target.value)}
            />

            <TextArea
              label="Responsibilities"
              name="responsibilities"
              rows={6}
              helperText="Enter one responsibility per line."
              value={form.responsibilities}
              onChange={(e) => update("responsibilities", e.target.value)}
            />

            <Input
              label="Display Order"
              name="displayOrder"
              type="number"
              value={form.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value))}
            />

            <div className="flex items-center gap-3">
              <input
                id="published"
                type="checkbox"
                checked={form.published}
                onChange={(e) => update("published", e.target.checked)}
              />

              <label htmlFor="published">Publish on Website</label>
            </div>

            <ImageUpload
              label="Profile Photo"
              value={form.image}
              onChange={(v: any) => update("image", v)}
            />

            <div className="flex gap-4 pt-2">

              <PrimaryButton type="submit" disabled={saving}>
                {saving ? "Updating..." : "Update Team Member"}
              </PrimaryButton>

              <SecondaryButton
                type="button"
                onClick={() => navigate("/admin/team")}
              >
                Cancel
              </SecondaryButton>

            </div>

          </form>

        )}

      </PageCard>

    </AdminLayout>
  );
};

export default EditTeam;
