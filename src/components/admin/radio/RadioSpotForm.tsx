import Input from "../Input";
import TextArea from "../TextArea";
import Toggle from "../Toggle";
import PrimaryButton from "../PrimaryButton";
import ImageUpload from "../ImageUpload";
import AudioUpload from "../AudioUpload";

interface Props {
  form: any;
  update: (field: string, value: any) => void;
  loading?: boolean;
  onSubmit: () => void;
}

const RadioSpotForm = ({
  form,
  update,
  loading = false,
  onSubmit,
}: Props) => {
  return (
    <div className="space-y-6">

      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
      />

      <TextArea
        label="Description"
        name="description"
        rows={4}
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-6">

        <Input
          label="Radio Station"
          name="station"
          value={form.station}
          onChange={(e) => update("station", e.target.value)}
        />

        <Input
          label="Duration"
          name="duration"
          placeholder="30 mins"
          value={form.duration}
          onChange={(e) => update("duration", e.target.value)}
        />

      </div>

      <Input
        label="Broadcast Date"
        name="broadcastAt"
        type="date"
        value={form.broadcastAt}
        onChange={(e) => update("broadcastAt", e.target.value)}
      />

      <ImageUpload
        label="Cover Image"
        value={form.image}
        onChange={(url) => update("image", url)}
      />

      <AudioUpload
        label="Audio (upload a file)"
        value={form.audioUrl}
        onChange={(url) => update("audioUrl", url)}
      />

      <Input
        label="…or paste a link (YouTube, Facebook, SoundCloud, or MP3 URL)"
        name="audioUrl"
        value={form.audioUrl}
        onChange={(e) => update("audioUrl", e.target.value)}
        placeholder="https://example.com/spot.mp3"
      />

      <div className="grid md:grid-cols-2 gap-6">

        <Toggle
          label="Published"
          checked={form.published}
          onChange={(checked) => update("published", checked)}
        />

        <Toggle
          label="Featured"
          checked={form.featured}
          onChange={(checked) => update("featured", checked)}
        />

      </div>

      <PrimaryButton
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Radio Spot"}
      </PrimaryButton>

    </div>
  );
};

export default RadioSpotForm;