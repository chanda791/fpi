import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";

import DocumentForm from "../../components/admin/document/DocumentForm";
import { publicationService } from "../../services/publicationService";

const CreatePublication = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    image: "",
    published: true,
    category: "Publication",
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

      await publicationService.create({
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        image: form.image,
        published: form.published,
      });

      alert("Publication created successfully.");

      navigate("/admin/publications");
    } catch (error) {
      console.error(error);
      alert("Unable to create publication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>

      <PageHeader
        title="Create Publication"
        subtitle="Create a new publication."
        backTo="/admin/publications"
      />

      <PageCard>

        <DocumentForm
          form={form}
          update={update}
          loading={loading}
          onSubmit={submit}
          showImage
        />

      </PageCard>

    </AdminLayout>
  );
};

export default CreatePublication;