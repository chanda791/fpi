import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import ImageUpload from "../../components/admin/ImageUpload";
import DocumentUpload from "../../components/admin/document/DocumentUpload";
import ProjectGalleryPicker from "../../components/admin/project/ProjectGalleryPicker";
import PrimaryButton from "../../components/admin/PrimaryButton";
import SecondaryButton from "../../components/admin/SecondaryButton";
import Loading from "../../components/admin/Loading";
import {
  programContentService,
  ProgramContent,
  ProgramSection,
} from "../../services/programContentService";

const PROGRAMS = [
  { slug: "advocacy", label: "Advocacy" },
  { slug: "media-literacy", label: "Media & Information Literacy" },
  { slug: "research", label: "Research" },
  { slug: "capacity-building", label: "Capacity Building" },
];

const ProgramsAdmin = () => {
  const [activeSlug, setActiveSlug] = useState(PROGRAMS[0].slug);
  const [data, setData] = useState<ProgramContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async (slug: string) => {
    try {
      setLoading(true);
      const item = await programContentService.getBySlug(slug);
      setData({ ...item, sections: item.sections || [] });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(activeSlug);
  }, [activeSlug]);

  const update = (field: keyof ProgramContent, value: any) =>
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const updateSection = (idx: number, field: keyof ProgramSection, value: string | string[]) => {
    if (!data) return;
    const sections = [...(data.sections || [])];
    sections[idx] = { ...sections[idx], [field]: value };
    setData({ ...data, sections });
  };

  // New sections are added to the front, not the back -- so the section you
  // just added is the one you land on (no scrolling past everything else to
  // find it), and it's also the one that shows first on the public page.
  const addSection = () => {
    if (!data) return;
    setData({
      ...data,
      sections: [{ heading: "", body: "", image: "", images: [], fileUrl: "" }, ...(data.sections || [])],
    });
  };

  const removeSection = (idx: number) => {
    if (!data) return;
    const sections = [...(data.sections || [])];
    sections.splice(idx, 1);
    setData({ ...data, sections });
  };

  const save = async () => {
    if (!data) return;
    try {
      setSaving(true);
      await programContentService.update(activeSlug, {
        title: data.title,
        subtitle: data.subtitle,
        heroImage: data.heroImage,
        intro: data.intro,
        sections: data.sections,
        published: data.published,
      });
      alert("Program page saved.");
    } catch (e) {
      console.error(e);
      alert("Unable to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Program Pages"
        subtitle="Edit the content shown on the Advocacy, Media Literacy, Research and Capacity Building pages"
      />

      <PageCard>
        <div className="flex flex-wrap gap-2 mb-6">
          {PROGRAMS.map((p) => (
            <button
              key={p.slug}
              onClick={() => setActiveSlug(p.slug)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeSlug === p.slug
                  ? "bg-[#C9293A] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading || !data ? (
          <Loading />
        ) : (
          <div className="space-y-5">
            <Input label="Title" name="title" value={data.title} onChange={(e) => update("title", e.target.value)} />
            <Input label="Subtitle" name="subtitle" value={data.subtitle || ""} onChange={(e) => update("subtitle", e.target.value)} />
            <ImageUpload label="Hero Image" value={data.heroImage} onChange={(url) => update("heroImage", url)} />
            <TextArea label="Introduction" name="intro" rows={4} value={data.intro || ""} onChange={(e) => update("intro", e.target.value)} />

            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800">Content Sections</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Newest section first -- that's also the order visitors see them in.
                  </p>
                </div>
                <SecondaryButton onClick={addSection}>
                  <Plus size={16} className="mr-1" /> Add Section
                </SecondaryButton>
              </div>

              {(data.sections || []).length === 0 && (
                <p className="text-slate-400 text-sm">No sections yet. Add one to build out the page.</p>
              )}

              <div className="space-y-5">
                {(data.sections || []).map((section, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 shrink-0 rounded-full bg-[#C9293A]/10 text-[#C9293A] font-bold text-sm flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-700 truncate">
                          {section.heading || "Untitled Section"}
                        </span>
                        {idx === 0 && (
                          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Shown First
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeSection(idx)}
                        className="shrink-0 p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                        title="Remove section"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="p-5 space-y-5">
                      <Input label="Section Heading" name={`h-${idx}`} value={section.heading || ""} onChange={(e) => updateSection(idx, "heading", e.target.value)} />
                      <TextArea label="Section Text" name={`b-${idx}`} rows={4} value={section.body || ""} onChange={(e) => updateSection(idx, "body", e.target.value)} />
                      <ImageUpload label="Cover Image (optional)" value={section.image} onChange={(url) => updateSection(idx, "image", url)} />
                      <ProjectGalleryPicker
                        value={section.images || []}
                        onChange={(urls) => updateSection(idx, "images", urls)}
                        label="Gallery Images (optional)"
                        helpText="Add extra photos for this section. They open in a gallery when a visitor reads more."
                      />
                      <DocumentUpload value={section.fileUrl || ""} onChange={(url) => updateSection(idx, "fileUrl", url)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <PrimaryButton onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save Program Page"}
              </PrimaryButton>
            </div>
          </div>
        )}
      </PageCard>
    </AdminLayout>
  );
};

export default ProgramsAdmin;
