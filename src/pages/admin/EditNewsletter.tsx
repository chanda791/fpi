import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";

import DocumentForm from "../../components/admin/document/DocumentForm";
import { newsletterService } from "../../services/newsletterService";

const EditNewsletter = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    published: true,
    category: "Newsletter",
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

        const data = await newsletterService.getById(Number(id));

        setForm({
          title: data.title || "",
          description: "",
          fileUrl: data.fileUrl || "",
          published: true,
          category: "Newsletter",
        });

      } catch (error) {

        console.error(error);

        alert("Unable to load newsletter.");

      } finally {

        setLoading(false);

      }

    };

    load();

  }, [id]);

  const submit = async () => {

    try {

      setSaving(true);

      await newsletterService.update(Number(id), {
        title: form.title,
        fileUrl: form.fileUrl,
      });

      alert("Newsletter updated successfully.");

      navigate("/admin/newsletters");

    } catch (error) {

      console.error(error);

      alert("Unable to update newsletter.");

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
        title="Edit Newsletter"
        subtitle="Update an existing newsletter."
        backTo="/admin/newsletters"
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

export default EditNewsletter;