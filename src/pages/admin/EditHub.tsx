import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const EditHub = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    coordinator: "",
    coordinatorImage: "",
    description: "",
    participants: 0,
    image: "",
    provinceId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hubRes, provinceRes] = await Promise.all([
          fetch(`${API_BASE_URL}/hubs/${id}`),
          fetch(`${API_BASE_URL}/provinces`),
        ]);

        const hub = await hubRes.json();
        const provinceData = await provinceRes.json();

        setProvinces(provinceData);

        setFormData({
          name: hub.name || "",
          location: hub.location || "",
          coordinator: hub.coordinator || "",
          coordinatorImage: hub.coordinatorImage || "",
          description: hub.description || "",
          participants: hub.participants || 0,
          image: hub.image || "",
          provinceId: String(hub.provinceId || ""),
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load hub.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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

    if (
      !formData.name ||
      !formData.location ||
      !formData.provinceId
    ) {
      alert(
        "Please complete all required fields."
      );
      return;
    }

    setSaving(true);

    try {
      const token =
        localStorage.getItem("fpi_admin_token") ||
        sessionStorage.getItem("fpi_admin_token");

      const response = await fetch(
        `${API_BASE_URL}/hubs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            ...formData,
            provinceId: Number(
              formData.provinceId
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Hub updated successfully.");

      navigate("/admin/hubs");
    } catch (error) {
      console.error(error);
      alert("Failed to update hub.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center">
          Loading Hub...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <PageHeader
        title="Edit MIL Hub"
        subtitle="Update Media & Information Literacy Hub information"
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
            label="Location"
            name="location"
            value={formData.location}
            onChange={(e) =>
              update(
                "location",
                e.target.value
              )
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

          <ImageUpload
            label="Coordinator Photo (optional)"
            value={formData.coordinatorImage}
            onChange={(url) => update("coordinatorImage", url)}
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
            <option value="">
              Select Province
            </option>

            {provinces.map((province) => (
              <option
                key={province.id}
                value={province.id}
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

          <div className="flex gap-4 pt-4">

            <PrimaryButton
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
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

export default EditHub;
