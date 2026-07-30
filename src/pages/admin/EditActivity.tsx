import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";

import ActivityForm from "../../components/admin/activity/ActivityForm";
import { API_BASE_URL } from "../../services/config";

const EditActivity = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    images: [] as string[],
    date: "",
    location: "",
    participants: 0,
    category: "",
    program: "",
    published: true,
  });

  const update = (
    field: string,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/activities/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load activity");
        }

        const data = await response.json();

        setForm({
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          image: data.image || "",
          images: Array.isArray(data.images) ? data.images : [],
          date: data.date
            ? data.date.substring(0, 10)
            : "",
          location: data.location || "",
          participants: data.participants || 0,
          category: data.category || "",
          program: data.program || "",
          published: data.published ?? true,
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load activity.");
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [id]);

  const submit = async () => {
    try {
      setSaving(true);

      const payload = {
        title: form.title,
        description: form.description,
        content: form.content,
        image: form.image,
        images: form.images,
        date: form.date,
        location: form.location,
        participants: form.participants,
        category: form.category,
        program: form.program,
        published: form.published,
      };

      const response = await fetch(
        `${API_BASE_URL}/activities/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update activity");
      }

      alert("Activity updated successfully.");

      navigate("/admin/activities");
    } catch (error) {
      console.error(error);
      alert("Unable to update activity.");
    } finally {
      setSaving(false);
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
        title="Edit Activity"
        subtitle="Update an existing activity."
        backTo="/admin/activities"
      />

      <PageCard>
        <ActivityForm
          form={form}
          update={update}
          loading={saving}
          onSubmit={submit}
        />
      </PageCard>
    </AdminLayout>
  );
};

export default EditActivity;
