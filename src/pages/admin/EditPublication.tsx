import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";

import DocumentForm from "../../components/admin/document/DocumentForm";
import { publicationService } from "../../services/publicationService";

const EditPublication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await publicationService.getById(Number(id));

        setForm({
          title: data.title || "",
          description: data.description || "",
          fileUrl: data.fileUrl || "",
          image: data.image || "",
          published: data.published ?? true,
          category: "Publication",
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load publication.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async () => {
    try {
      setSaving(true);

      await publicationService.update(Number(id), {
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        image: form.image,
        published: form.published,
      });

      alert("Publication updated successfully.");

      navigate("/admin/publications");
    } catch (error) {
      console.error(error);
      alert("Unable to update publication.");
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
        title="Edit Publication"
        subtitle="Update an existing publication."
        backTo="/admin/publications"
      />

      <PageCard>

        <DocumentForm
          form={form}
          update={update}
          loading={saving}
          onSubmit={submit}
          showImage
        />

      </PageCard>

    </AdminLayout>
  );
};

export default EditPublication;