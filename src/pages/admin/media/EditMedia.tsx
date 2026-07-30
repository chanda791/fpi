import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  Image,
  FileText,
} from "lucide-react";

import AdminLayout from "../../../components/admin/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import PageCard from "../../../components/admin/PageCard";
import Input from "../../../components/admin/Input";
import TextArea from "../../../components/admin/TextArea";
import PrimaryButton from "../../../components/admin/PrimaryButton";
import SecondaryButton from "../../../components/admin/SecondaryButton";
import Loading from "../../../components/admin/Loading";
import { API_BASE_URL } from "../../../services/config";

interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  description?: string;
  alt?: string;
}

const EditMedia = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [formData, setFormData] = useState({
    originalName: "",
    description: "",
    alt: "",
  });

  const update = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
    useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/media/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load media");
        }

        const data: MediaFile = await response.json();

        setPreview(data.url);

        setFormData({
          originalName: data.originalName || "",
          description: data.description || "",
          alt: data.alt || "",
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load media.");
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [id]);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const body = new FormData();

      body.append(
        "originalName",
        formData.originalName
      );

      body.append(
        "description",
        formData.description
      );

      body.append(
        "alt",
        formData.alt
      );

      if (selectedFile) {
        body.append("file", selectedFile);
      }

      const response = await fetch(
        `${API_BASE_URL}/media/${id}`,
        {
          method: "PUT",
          body,
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Media updated successfully.");

      navigate("/admin/media");

    } catch (error) {

      console.error(error);

      alert("Unable to update media.");

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
        title="Edit Media"
        subtitle="Update file information or replace the uploaded file."
        backTo="/admin/media"
      />

      <PageCard>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Preview */}

          <div>

            <h3 className="text-lg font-semibold mb-4">
              Current File
            </h3>

            <div className="border rounded-2xl overflow-hidden bg-slate-100">

              {preview ? (
                selectedFile?.type.startsWith("image") ||
                preview.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (

                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-80 object-cover"
                  />

                ) : (

                  <div className="h-80 flex items-center justify-center">
                    <FileText
                      size={80}
                      className="text-slate-400"
                    />
                  </div>

                )
              ) : (

                <div className="h-80 flex items-center justify-center">
                  <Image
                    size={80}
                    className="text-slate-300"
                  />
                </div>

              )}

            </div>

            <label className="mt-6 flex items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-xl p-5 cursor-pointer hover:border-[#C9293A] hover:bg-red-50 transition">

              <Upload size={22} />

              <span className="font-medium">
                Replace File
              </span>

              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />

            </label>

          </div>

          {/* Form */}

          <div className="space-y-5">

            <Input
              label="File Name"
              name="originalName"
              value={formData.originalName}
              onChange={(e) =>
                update(
                  "originalName",
                  e.target.value
                )
              }
            />

            <Input
              label="Alternative Text"
              name="alt"
              value={formData.alt}
              onChange={(e) =>
                update(
                  "alt",
                  e.target.value
                )
              }
            />

            <TextArea
              label="Description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
            />

            <div className="flex gap-4 pt-4">

              <PrimaryButton
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </PrimaryButton>

              <SecondaryButton
                onClick={() =>
                  navigate("/admin/media")
                }
              >
                Cancel
              </SecondaryButton>

            </div>

          </div>

        </div>

      </PageCard>

    </AdminLayout>
  );
};

export default EditMedia;
