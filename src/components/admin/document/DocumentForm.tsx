import { useState } from "react";

import Input from "../Input";
import TextArea from "../TextArea";
import ImageUpload from "../ImageUpload";
import PrimaryButton from "../PrimaryButton";

import DocumentCategorySelect from "./DocumentCategorySelect";
import DocumentUpload from "./DocumentUpload";
import PublishSwitch from "./PublishSwitch";

interface Props {
  form: any;
  update: (field: string, value: any) => void;
  loading?: boolean;
  onSubmit: () => void;
  showImage?: boolean;
}

const DocumentForm = ({
  form,
  update,
  loading = false,
  onSubmit,
  showImage = false,
}: Props) => {
  const [fileUploading, setFileUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const uploading = fileUploading || imageUploading;

  const handleSubmit = () => {
    if (uploading) {
      alert("Please wait for the upload to finish before saving.");
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-5">

      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={(e) =>
          update("title", e.target.value)
        }
      />

      <DocumentCategorySelect
        value={form.category}
        onChange={(value) =>
          update("category", value)
        }
      />

      <DocumentUpload
        value={form.fileUrl}
        onChange={(url) =>
          update("fileUrl", url)
        }
        onUploadingChange={setFileUploading}
      />

      {showImage && (
        <ImageUpload
          label="Cover Image (optional)"
          value={form.image}
          onChange={(url) => update("image", url)}
          onUploadingChange={setImageUploading}
        />
      )}

      <TextArea
        label="Description"
        name="description"
        rows={6}
        value={form.description}
        onChange={(e) =>
          update("description", e.target.value)
        }
      />

      <PublishSwitch
        checked={form.published}
        onChange={(checked) =>
          update("published", checked)
        }
      />

      <PrimaryButton
        onClick={handleSubmit}
        disabled={loading || uploading}
      >
        {loading
          ? "Saving..."
          : uploading
          ? "Waiting for upload..."
          : "Save Document"}
      </PrimaryButton>

    </div>
  );
};

export default DocumentForm;