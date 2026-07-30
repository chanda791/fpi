import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import ImageUpload from "../../components/admin/ImageUpload";
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

  const updateSection = (idx: number, field: keyof ProgramSection, value: string) => {
    if (!data) return;
    const sections = [...(data.sections || [])];
    sections[idx] = { ...sections[idx], [field]: value };
    setData({ ...data, sections });
  };

  const addSection = () => {
    if (!data) return;
    setData({ ...data, sections: [...(data.sections || []), { heading: "", body: "", image: "" }] });
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800">Content Sections</h3>
                <SecondaryButton onClick={addSection}>
                  <Plus size={16} className="mr-1" /> Add Section
                </SecondaryButton>
              </div>

              {(data.sections || []).length === 0 && (
                <p className="text-slate-400 text-sm">No sections yet. Add one to build out the page.</p>
              )}

              <div className="space-y-4">
                {(data.sections || []).map((section, idx) => (
                  <div key={idx} className="border rounded-2xl p-5 bg-slate-50 relative">
                    <button
                      onClick={() => removeSection(idx)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-100 text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                    <div className="space-y-4">
                      <Input label="Section Heading" name={`h-${idx}`} value={section.heading || ""} onChange={(e) => updateSection(idx, "heading", e.target.value)} />
                      <TextArea label="Section Text" name={`b-${idx}`} rows={4} value={section.body || ""} onChange={(e) => updateSection(idx, "body", e.target.value)} />
                      <ImageUpload label="Section Image (optional)" value={section.image} onChange={(url) => updateSection(idx, "image", url)} />
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
