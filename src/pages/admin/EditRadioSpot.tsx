import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";

import RadioSpotForm from "../../components/admin/radio/RadioSpotForm";
import { radioSpotService } from "../../services/radioSpotService";

const EditRadioSpot = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    station: "",
    duration: "",
    image: "",
    audioUrl: "",
    broadcastAt: "",
    published: true,
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
        const data = await radioSpotService.getById(Number(id));

        setForm({
          title: data.title || "",
          description: data.description || "",
          station: data.station || "",
          duration: data.duration || "",
          image: data.image || "",
          audioUrl: data.audioUrl || "",
          broadcastAt: data.broadcastAt
            ? data.broadcastAt.substring(0, 10)
            : "",
          published: data.published ?? true,
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load radio spot.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async () => {
    try {
      setSaving(true);

      await radioSpotService.update(Number(id), form);

      alert("Radio Spot updated successfully.");

      navigate("/admin/radio-spots");
    } catch (error) {
      console.error(error);
      alert("Unable to update radio spot.");
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
        title="Edit Radio Spot"
        subtitle="Update an existing radio programme."
        backTo="/admin/radio-spots"
      />

      <PageCard>

        <RadioSpotForm
          form={form}
          update={update}
          loading={saving}
          onSubmit={submit}
        />

      </PageCard>

    </AdminLayout>
  );
};

export default EditRadioSpot;