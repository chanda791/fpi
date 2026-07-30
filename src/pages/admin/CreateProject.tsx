import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import ProjectForm from "../../components/admin/project/ProjectForm";

import { projectService } from "../../services/projectService";

const CreateProject = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    images: [] as string[],
    category: "",
    status: "Planning",
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

  const submit = async () => {
    try {
      setLoading(true);

      await projectService.create(form);

      alert("Project created successfully.");

      navigate("/admin/projects");
    } catch (error) {
      console.error(error);
      alert("Unable to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Create Project"
        subtitle="Create a new FPI Zambia project."
        backTo="/admin/projects"
      />

      <PageCard>
        <ProjectForm
          form={form}
          update={update}
          loading={loading}
          onSubmit={submit}
        />
      </PageCard>
    </AdminLayout>
  );
};

export default CreateProject;