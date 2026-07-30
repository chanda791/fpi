import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  Image as ImageIcon,
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

const UploadMedia = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [alt, setAlt] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);

    if (selected.type.startsWith("image")) {
      setPreview(
        URL.createObjectURL(selected)
      );
    } else {
      setPreview("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "originalName",
        file.name
      );
      formData.append("alt", alt);
      formData.append(
        "description",
        description
      );

      const response = await fetch(
        `${API_BASE_URL}/media`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("Media uploaded successfully.");

      navigate("/admin/media");

    } catch (error) {

      console.error(error);

      alert("Upload failed.");

    } finally {

      setLoading(false);

    }
  };

  const handleCancel = () => {
    navigate("/admin/media");
  };
    return (
    <AdminLayout>

      <PageHeader
        title="Upload Media"
        subtitle="Upload images, reports, newsletters, brochures and other files."
        backTo="/admin/media"
      />

      <PageCard>

        {loading ? (

          <Loading />

        ) : (

          <>

            {/* Upload Area */}

            <div className="border-2 border-dashed border-slate-300 hover:border-[#C9293A] transition rounded-2xl p-10">

              <div className="flex flex-col items-center text-center">

                <Upload
                  size={60}
                  className="text-[#C9293A] mb-5"
                />

                <h2 className="text-2xl font-bold text-slate-800">
                  Upload a Media File
                </h2>

                <p className="text-slate-500 mt-2">
                  Images, PDFs, Word documents,
                  Excel files and more.
                </p>

                <input
                  type="file"
                  id="media-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="media-upload"
                  className="mt-8 cursor-pointer bg-[#C9293A] hover:bg-[#a61d2c] transition text-white px-6 py-3 rounded-xl font-medium"
                >
                  Select File
                </label>

              </div>

            </div>

            {/* Preview */}

            {file && (

              <div className="mt-8 rounded-2xl border bg-slate-50 p-6">

                <div className="flex flex-col md:flex-row gap-6">

                  <div className="w-52 h-52 rounded-xl overflow-hidden border bg-white flex items-center justify-center">

                    {preview ? (

                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <FileText
                        size={70}
                        className="text-slate-400"
                      />

                    )}

                  </div>

                  <div className="flex-1 space-y-4">

                    <div className="flex items-center gap-3">

                      {file.type.startsWith("image") ? (

                        <ImageIcon
                          className="text-[#C9293A]"
                          size={22}
                        />

                      ) : (

                        <FileText
                          className="text-[#C9A227]"
                          size={22}
                        />

                      )}

                      <span className="font-semibold text-lg">

                        {file.name}

                      </span>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                      <div className="rounded-xl bg-white border p-4">

                        <p className="text-sm text-slate-500">
                          File Size
                        </p>

                        <p className="font-semibold">

                          {(file.size / 1024).toFixed(2)} KB

                        </p>

                      </div>

                      <div className="rounded-xl bg-white border p-4">

                        <p className="text-sm text-slate-500">
                          File Type
                        </p>

                        <p className="font-semibold">

                          {file.type}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            )}

            {/* Metadata */}

            <div className="mt-8 grid gap-6">

              <Input
                label="Alternative Text"
                name="alt"
                value={alt}
                onChange={(e) =>
                  setAlt(e.target.value)
                }
                placeholder="Describe the image for accessibility..."
              />

              <TextArea
                label="Description"
                name="description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={6}
                placeholder="Enter a short description..."
              />

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-4 mt-10">

              <SecondaryButton
                onClick={handleCancel}
              >

                <X
                  size={18}
                  className="mr-2"
                />

                Cancel

              </SecondaryButton>

              <PrimaryButton
                onClick={handleUpload}
                disabled={!file}
              >

                <Upload
                  size={18}
                  className="mr-2"
                />

                Upload Media

              </PrimaryButton>

            </div>

          </>

        )}

      </PageCard>
          </AdminLayout>
  );
};

export default UploadMedia;
