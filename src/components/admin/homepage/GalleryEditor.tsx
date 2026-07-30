import { useEffect, useState } from "react";

import PrimaryButton from "../PrimaryButton";
import Loading from "../Loading";

import { homepageService } from "../../../services/homepageService";
import { mediaService, Media } from "../../../services/mediaService";
import { getAssetUrl } from "../../../services/config";

const GalleryEditor = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {

      const images = await mediaService.getAll();

      setMedia(images.filter((item) => item.mimeType.startsWith("image")));

      const section =
        await homepageService.getSection("gallery");

      if (section?.data) {
        setSelected(section.data);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

      setSaving(true);

      await homepageService.updateSection(
        "gallery",
        {
          data: selected,
        }
      );

      alert("Homepage gallery updated.");

    } catch (error) {
      console.error(error);
      alert("Unable to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (

    <div className="space-y-8">

      <div>

        <h2 className="text-2xl font-bold">
          Homepage Gallery
        </h2>

        <p className="text-gray-500 mt-2">
          Select images that should appear on the homepage.
        </p>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">

        {media.map((image) => (

          <div
            key={image.id}
            onClick={() => toggle(image.id)}
            className={`cursor-pointer rounded-xl border overflow-hidden transition ${
              selected.includes(image.id)
                ? "border-red-600 ring-2 ring-red-300"
                : "border-gray-200"
            }`}
          >

            <img
              src={getAssetUrl(image.url)}
              alt={image.originalName}
              className="w-full h-40 object-cover"
            />

            <div className="p-3">

              <h3 className="text-sm font-medium line-clamp-2">
                {image.originalName}
              </h3>

            </div>

          </div>

        ))}

      </div>

      <PrimaryButton
        onClick={save}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Gallery"}
      </PrimaryButton>

    </div>

  );
};

export default GalleryEditor;