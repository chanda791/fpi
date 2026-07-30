import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";

import DocumentForm from "../../components/admin/document/DocumentForm";
import { reportService } from "../../services/reportService";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    published: true,
    category: "Report",
  });

  const update = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await reportService.getById(Number(id));

        setForm({
          title: data.title || "",
          description: data.description || "",
          fileUrl: data.fileUrl || "",
          published: data.published ?? true,
          category: "Report",
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load report.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async () => {
    try {
      setSaving(true);

      await reportService.update(Number(id), {
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        published: form.published,
      });

      alert("Report updated successfully.");

      navigate("/admin/reports");
    } catch (error) {
      console.error(error);
      alert("Unable to update report.");
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
        title="Edit Report"
        subtitle="Update an existing report."
        backTo="/admin/reports"
      />

      <PageCard>

        <DocumentForm
          form={form}
          update={update}
          loading={saving}
          onSubmit={submit}
        />

      </PageCard>

    </AdminLayout>
  );
};

export default EditReport;
