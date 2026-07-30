import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";

import ProjectForm from "../../components/admin/project/ProjectForm";

import { projectService } from "../../services/projectService";

const EditProject = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    images: [] as string[],
    category: "",
    status: "",
    startDate: "",
    endDate: "",
    published: true,
  });

  const update = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        const project = await projectService.getById(Number(id));

        setForm({
          title: project.title || "",
          description: project.description || "",
          content: project.content || "",
          image: project.image || "",
          images: Array.isArray(project.images) ? project.images : [],
          category: project.category || "",
          status: project.status || "",
          startDate: project.startDate
            ? project.startDate.substring(0, 10)
            : "",
          endDate: project.endDate
            ? project.endDate.substring(0, 10)
            : "",
          published: project.published ?? true,
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load project.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const submit = async () => {
    try {
      setSaving(true);

      await projectService.update(Number(id), form);

      alert("Project updated successfully.");

      navigate("/admin/projects");
    } catch (error) {
      console.error(error);
      alert("Unable to update project.");
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
        title="Edit Project"
        subtitle="Update an existing project."
        backTo="/admin/projects"
      />

      <PageCard>
        <ProjectForm
          form={form}
          update={update}
          loading={saving}
          onSubmit={submit}
        />
      </PageCard>
    </AdminLayout>
  );
};

export default EditProject;