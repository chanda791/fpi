import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";

import DocumentForm from "../../components/admin/document/DocumentForm";
import { pressStatementService } from "../../services/pressStatementService";

const CreatePressStatement = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    published: true,
    category: "Press Statement",
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

      await pressStatementService.create({
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        published: form.published,
      });

      alert("Press Statement created successfully.");

      navigate("/admin/press-statements");

    } catch (error) {

      console.error(error);

      alert("Unable to create Press Statement.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <AdminLayout>

      <PageHeader
        title="Create Press Statement"
        subtitle="Create a new press statement."
        backTo="/admin/press-statements"
      />

      <PageCard>

        <DocumentForm
          form={form}
          update={update}
          loading={loading}
          onSubmit={submit}
        />

      </PageCard>

    </AdminLayout>
  );
};

export default CreatePressStatement;