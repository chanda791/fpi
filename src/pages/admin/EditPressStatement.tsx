import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";

import DocumentForm from "../../components/admin/document/DocumentForm";
import { pressStatementService } from "../../services/pressStatementService";

const EditPressStatement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await pressStatementService.getById(Number(id));

        setForm({
          title: data.title || "",
          description: data.description || "",
          fileUrl: data.fileUrl || "",
          published: data.published ?? true,
          category: "Press Statement",
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load Press Statement.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async () => {
    try {
      setSaving(true);

      await pressStatementService.update(Number(id), {
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        published: form.published,
      });

      alert("Press Statement updated successfully.");

      navigate("/admin/press-statements");
    } catch (error) {
      console.error(error);
      alert("Unable to update Press Statement.");
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
        title="Edit Press Statement"
        subtitle="Update an existing press statement."
        backTo="/admin/press-statements"
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

export default EditPressStatement;