import Input from "../Input";
import TextArea from "../TextArea";
import ImageUpload from "../ImageUpload";
import PrimaryButton from "../PrimaryButton";
import Toggle from "../Toggle";

import ProgramSelect from "./ProgramSelect";
import CategorySelect from "./CategorySelect";
import ProvinceSelect from "./ProvinceSelect";
import ActivityGalleryPicker from "./ActivityGalleryPicker";

interface Props {
  form: any;
  update: (field: string, value: any) => void;
  loading?: boolean;
  onSubmit: () => void;
}

const ActivityForm = ({
  form,
  update,
  loading = false,
  onSubmit,
}: Props) => {
  return (
    <div className="space-y-5">

      <Input
        label="Activity Title"
        name="title"
        value={form.title}
        onChange={(e) =>
          update("title", e.target.value)
        }
      />

      <ProgramSelect
        value={form.program}
        onChange={(value) =>
          update("program", value)
        }
      />

      <CategorySelect
        value={form.category}
        onChange={(value) =>
          update("category", value)
        }
      />

      <ProvinceSelect
        value={form.location}
        onChange={(value) =>
          update("location", value)
        }
      />

      <div className="grid md:grid-cols-2 gap-6">

        <Input
          label="Activity Date"
          name="date"
          type="date"
          value={form.date}
          onChange={(e) =>
            update("date", e.target.value)
          }
        />

        <Input
          label="Participants"
          name="participants"
          type="number"
          value={form.participants}
          onChange={(e) =>
            update(
              "participants",
              Number(e.target.value)
            )
          }
        />

      </div>

      <ImageUpload
        label="Featured Image"
        value={form.image}
        onChange={(url) =>
          update("image", url)
        }
      />

      <ActivityGalleryPicker
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
          update(
            "description",
            e.target.value
          )
        }
      />

      <TextArea
        label="Full Content"
        name="content"
        rows={10}
        value={form.content}
        onChange={(e) =>
          update(
            "content",
            e.target.value
          )
        }
      />

      <Toggle
        label="Publish Activity"
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
            : "Save Activity"}
        </PrimaryButton>

      </div>

    </div>
  );
};

export default ActivityForm;