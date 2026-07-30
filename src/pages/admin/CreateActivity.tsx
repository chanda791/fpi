import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";

import ActivityForm from "../../components/admin/activity/ActivityForm";

import { activityService } from "../../services/activityService";

const CreateActivity = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  const submit = async () => {
    try {
      setLoading(true);

      const payload = {
        title: form.title,
        description: form.description,
        content: form.content,
        image: form.image,
        images: form.images,
        program: form.program,
        category: form.category,
        location: form.location,
        participants: form.participants,
        date: form.date,
        published: form.published,
      };


      await activityService.create(payload);

      alert("Activity created successfully.");

      navigate("/admin/activities");
    } catch (error) {
      console.error(error);
      alert("Unable to create activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Create Activity"
        subtitle="Create a new FPI Zambia activity."
        backTo="/admin/activities"
      />

      <PageCard>
        <ActivityForm
          form={form}
          update={update}
          loading={loading}
          onSubmit={submit}
        />
      </PageCard>
    </AdminLayout>
  );
};

export default CreateActivity;
