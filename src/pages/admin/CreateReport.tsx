import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import DocumentForm from "../../components/admin/document/DocumentForm";

import { reportService } from "../../services/reportService";

const CreateReport = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Report",
    fileUrl: "",
    image: "",
    published: true,
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

      await reportService.create({
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        image: form.image,
        published: form.published,
      });

      alert("Report created successfully.");

      navigate("/admin/reports");
    } catch (error) {
      console.error(error);
      alert("Failed to create report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Create Report"
        subtitle="Create a new report."
        backTo="/admin/reports"
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

export default CreateReport;