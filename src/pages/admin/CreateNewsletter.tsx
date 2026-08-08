import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";

import DocumentForm from "../../components/admin/document/DocumentForm";
import { newsletterService } from "../../services/newsletterService";

const CreateNewsletter = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    image: "",
    publishDate: "",
    published: true,
    category: "Newsletter",
  });

  const update = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async () => {
    try {
      setLoading(true);

      await newsletterService.create({
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        image: form.image,
        publishDate: form.publishDate || undefined,
        published: form.published,
      });

      alert("Newsletter created successfully.");

      navigate("/admin/newsletters");

    } catch (error) {

      console.error(error);

      alert("Unable to create newsletter.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <AdminLayout>

      <PageHeader
        title="Create Newsletter"
        subtitle="Create a new newsletter."
        backTo="/admin/newsletters"
      />

      <PageCard>

        <DocumentForm
          form={form}
          update={update}
          loading={loading}
          onSubmit={submit}
          showImage
          showDate
        />

      </PageCard>

    </AdminLayout>
  );
};

export default CreateNewsletter;