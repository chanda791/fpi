import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import Select from "../../components/admin/Select";
import ImageUpload from "../../components/admin/ImageUpload";
import PrimaryButton from "../../components/admin/PrimaryButton";
import SecondaryButton from "../../components/admin/SecondaryButton";
import { API_BASE_URL } from "../../services/config";

interface Province {
  id: number;
  name: string;
}

const CreateHub = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    location: "",
    coordinator: "",
    participants: 0,
    description: "",
    image: "",
    provinceId: "",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/provinces`)
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(console.error);
  }, []);

  const update = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/hubs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            provinceId: Number(
              formData.provinceId
            ),
          }),
        }
      );

      if (response.ok) {
        navigate("/admin/hubs");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Create MIL Hub"
        subtitle="Add a new Media & Information Literacy Hub"
        backTo="/admin/hubs"
      />

      <PageCard>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <Input
            label="Hub Name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              update("name", e.target.value)
            }
          />

          <Input
            label="Slug"
            name="slug"
            placeholder="lusaka-central"
            value={formData.slug}
            onChange={(e) =>
              update("slug", e.target.value)
            }
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={(e) =>
              update("location", e.target.value)
            }
          />

          <Input
            label="Coordinator"
            name="coordinator"
            value={formData.coordinator}
            onChange={(e) =>
              update(
                "coordinator",
                e.target.value
              )
            }
          />

          <Input
            type="number"
            label="Participants"
            name="participants"
            value={String(
              formData.participants
            )}
            onChange={(e) =>
              update(
                "participants",
                Number(e.target.value)
              )
            }
          />

          <Select
            label="Province"
            name="provinceId"
            value={formData.provinceId}
            onChange={(e) =>
              update(
                "provinceId",
                e.target.value
              )
            }
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option
                key={province.id}
                value={String(province.id)}
              >
                {province.name}
              </option>
            ))}
          </Select>

          <TextArea
            label="Description"
            name="description"
            rows={8}
            value={formData.description}
            onChange={(e) =>
              update(
                "description",
                e.target.value
              )
            }
          />

          <ImageUpload
            label="Hub Image"
            value={formData.image}
            onChange={(url) => update("image", url)}
          />

          <div className="flex gap-4">

            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Hub"}
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() =>
                navigate("/admin/hubs")
              }
            >
              Cancel
            </SecondaryButton>

          </div>

        </form>

      </PageCard>
    </AdminLayout>
  );
};

export default CreateHub;
