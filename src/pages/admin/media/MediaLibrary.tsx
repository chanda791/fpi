import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Upload,
  Image,
  FileText,
  Trash2,
  Pencil,
  Eye,
  Download,
} from "lucide-react";

import AdminLayout from "../../../components/admin/AdminLayout";
import DocumentPreviewModal from "../../../components/DocumentPreviewModal";
import { API_BASE_URL, getAssetUrl, getDownloadUrl } from "../../../services/config";
import PageHeader from "../../../components/admin/PageHeader";
import PageCard from "../../../components/admin/PageCard";
import Loading from "../../../components/admin/Loading";
import EmptyState from "../../../components/admin/EmptyState";
import Input from "../../../components/admin/Input";
import PrimaryButton from "../../../components/admin/PrimaryButton";

interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string;
  description: string;
  createdAt: string;
}

const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/media`)
      .then((res) => res.json())
      .then((data) => {
        setMedia(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredMedia = useMemo(() => {
    return media.filter((file) =>
      file.originalName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [media, search]);

  const deleteMedia = async (id: number) => {
    const confirmDelete = window.confirm("Delete this file?");
    if (!confirmDelete) return;

    try {
      await fetch(`${API_BASE_URL}/media/${id}`, {
        method: "DELETE",
      });
      setMedia((prev) => prev.filter((file) => file.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete file.");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Media Library"
        subtitle="Manage images, reports, brochures, newsletters and other uploaded files."
      />

      <PageCard>
        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row gap-5 justify-between mb-8">
          <div className="flex-1">
            <Input
              label="Search Files"
              name="search"
              value={search}
              placeholder="Search media..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>

          <Link to="/admin/media/upload">
            <PrimaryButton>
              <Upload size={18} className="mr-2" />
              Upload Media
            </PrimaryButton>
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : filteredMedia.length === 0 ? (
          <EmptyState
            title="No Media Found"
            description="Upload your first image or document."
            buttonText="Upload Media"
            buttonLink="/admin/media/upload"
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((file) => (
              <div
                key={file.id}
                className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* PREVIEW */}
                <div className="h-52 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {file.mimeType.startsWith("image") ? (
                  <img
                    src={getAssetUrl(file.url)}
                    alt={file.alt || file.originalName}
                    className="w-full h-full object-cover"
                  />
                  ) : (
                    <FileText size={70} className="text-slate-400" />
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {file.mimeType.startsWith("image") ? (
                      <Image size={18} className="text-[#C9293A]" />
                    ) : (
                      <FileText size={18} className="text-[#C9A227]" />
                    )}
                    <span className="text-xs text-slate-500 uppercase">
                      {file.mimeType}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-800 truncate">
                    {file.originalName}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex justify-between mt-5">
                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                      <Eye size={18} />
                    </button>

                    <a
                      href={getDownloadUrl(file.url, file.originalName)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center transition"
                    >
                      <Download size={18} />
                    </a>

                    <Link
                      to={`/admin/media/${file.id}/edit`}
                      className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center transition"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      onClick={() => deleteMedia(file.id)}
                      className="w-10 h-10 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageCard>

      {previewFile && (
        <DocumentPreviewModal
          fileUrl={previewFile.url}
          title={previewFile.originalName}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </AdminLayout>
  );
};

export default MediaLibrary;
