import { useEffect, useState } from "react";

import PrimaryButton from "../PrimaryButton";

import { homepageService } from "../../../services/homepageService";
import { projectService } from "../../../services/projectService";

interface Project {
  id: number;
  title: string;
}

const FeaturedProjectsEditor = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const allProjects = await projectService.getAll();
      setProjects(allProjects);

      const section =
        await homepageService.getSection(
          "featured-projects"
        );

      if (section?.data) {
        setSelected(section.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const save = async () => {
    try {
      setLoading(true);

      await homepageService.updateSection(
        "featured-projects",
        {
          data: selected,
        }
      );

      alert("Featured Projects updated.");
    } catch (error) {
      console.error(error);
      alert("Unable to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold">
        Featured Projects
      </h2>

      <div className="space-y-4">

        {projects.map((project) => (

          <label
            key={project.id}
            className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
          >

            <input
              type="checkbox"
              checked={selected.includes(project.id)}
              onChange={() => toggle(project.id)}
            />

            <span>{project.title}</span>

          </label>

        ))}

      </div>

      <PrimaryButton
        onClick={save}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Save Featured Projects"}
      </PrimaryButton>

    </div>
  );
};

export default FeaturedProjectsEditor;