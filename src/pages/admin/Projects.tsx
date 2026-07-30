import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import { getAssetUrl } from "../../services/config";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import PrimaryButton from "../../components/admin/PrimaryButton";
import Badge from "../../components/admin/Badge";

import SearchBar from "../../components/admin/common/SearchBar";
import DataTable from "../../components/admin/common/DataTable";

import { projectService } from "../../services/projectService";
import { Project } from "../../types/project";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error(error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await projectService.remove(id);

      setProjects((prev) =>
        prev.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete project.");
    }
  };

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      return (
        project.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        project.category
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        project.status
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [projects, search]);

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
        title="Projects"
        subtitle="Manage all FPI Zambia projects"
      />

      <PageCard>

        <div className="flex justify-between items-center mb-6">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search projects..."
          />

          <Link to="/admin/projects/create">
            <PrimaryButton>
              <Plus size={18} className="mr-2" />
              Create Project
            </PrimaryButton>
          </Link>

        </div>

        {filtered.length === 0 ? (

          <EmptyState
            title="No Projects Found"
            description="Create your first project."
            buttonText="Create Project"
            buttonLink="/admin/projects/create"
          />

        ) : (

          <DataTable<Project>
            data={filtered}
            columns={[
              {
                key: "image",
                title: "Image",
                render: (project) => (
                  <img
                    src={
                      project.image
                        ? getAssetUrl(project.image)
                        : "/images/default-project.jpg"
                    }
                    alt={project.title}
                    className="w-20 h-16 rounded-xl object-cover border"
                  />
                ),
              },
              {
                key: "title",
                title: "Title",
              },
              {
                key: "category",
                title: "Category",
              },
              {
                key: "status",
                title: "Status",
              },
              {
                key: "published",
                title: "Published",
                render: (project) => (
                  <Badge
                    status={
                      project.published
                        ? "published"
                        : "draft"
                    }
                  />
                ),
              },
              {
                key: "actions",
                title: "Actions",
                render: (project) => (
                  <div className="flex gap-3">

                    <Link
                      to={`/projects/${project.id}`}
                    >
                      <Eye size={18} />
                    </Link>

                    <Link
                      to={`/admin/projects/${project.id}/edit`}
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      onClick={() => remove(project.id)}
                    >
                      <Trash2
                        size={18}
                        className="text-red-600"
                      />
                    </button>

                  </div>
                ),
              },
            ]}
          />

        )}

      </PageCard>

    </AdminLayout>
  );
};

export default Projects;
