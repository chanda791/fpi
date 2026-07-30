import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import RadioSpotForm from "../../components/admin/radio/RadioSpotForm";

import { radioSpotService } from "../../services/radioSpotService";

const CreateRadioSpot = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    station: "",
    duration: "",
    image: "",
    audioUrl: "",
    broadcastAt: "",
    published: true,
    featured: false,
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

      await radioSpotService.create(form);

      alert("Radio Spot created successfully.");

      navigate("/admin/radio-spots");
    } catch (error) {
      console.error(error);
      alert("Unable to create radio spot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>

      <PageHeader
        title="Create Radio Spot"
        subtitle="Create a new radio programme."
        backTo="/admin/radio-spots"
      />

      <PageCard>

        <RadioSpotForm
          form={form}
          update={update}
          loading={loading}
          onSubmit={submit}
        />

      </PageCard>

    </AdminLayout>
  );
};

export default CreateRadioSpot;