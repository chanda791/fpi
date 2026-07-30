import Input from "../Input";
import TextArea from "../TextArea";
import PrimaryButton from "../PrimaryButton";

import ProjectCategorySelect from "./ProjectCategorySelect";
import ProjectStatusSelect from "./ProjectStatusSelect";
import ProjectImagePicker from "./ProjectImagePicker";
import ProjectGalleryPicker from "./ProjectGalleryPicker";
import PublishSwitch from "./PublishSwitch";

interface Props {
  form: any;
  update: (field: string, value: any) => void;
  loading?: boolean;
  onSubmit: () => void;
}

const ProjectForm = ({
  form,
  update,
  loading = false,
  onSubmit,
}: Props) => {
  return (
    <div className="space-y-5">

      <Input
        label="Project Title"
        name="title"
        value={form.title}
        onChange={(e) =>
          update("title", e.target.value)
        }
      />

      <ProjectCategorySelect
        value={form.category}
        onChange={(value) =>
          update("category", value)
        }
      />

      <ProjectStatusSelect
        value={form.status}
        onChange={(value) =>
          update("status", value)
        }
      />

      <div className="grid md:grid-cols-2 gap-6">

        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={(e) =>
            update("startDate", e.target.value)
          }
        />

        <Input
          label="End Date"
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={(e) =>
            update("endDate", e.target.value)
          }
        />

      </div>

      <ProjectImagePicker
        value={form.image}
        onChange={(url) =>
          update("image", url)
        }
      />

      <ProjectGalleryPicker
        value={form.images || []}
        onChange={(urls) =>
          update("images", urls)
        }
      />

      <TextArea
        label="Short Description"
        name="description"
        rows={4}
        value={form.description}
        onChange={(e) =>
          update("description", e.target.value)
        }
      />

      <TextArea
        label="Project Content"
        name="content"
        rows={10}
        value={form.content}
        onChange={(e) =>
          update("content", e.target.value)
        }
      />

      <PublishSwitch
        checked={form.published}
        onChange={(checked) =>
          update("published", checked)
        }
      />

      <div className="pt-4">

        <PrimaryButton
          onClick={onSubmit}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Project"}
        </PrimaryButton>

      </div>

    </div>
  );
};

export default ProjectForm;