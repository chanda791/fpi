import { useEffect, useState } from "react";

import Input from "../Input";
import PrimaryButton from "../PrimaryButton";
import { homepageService } from "../../../services/homepageService";

interface ActivitySettings {
  count: number;
  featuredOnly: boolean;
  showImages: boolean;
}

const LatestActivitiesEditor = () => {
  const [settings, setSettings] = useState<ActivitySettings>({
    count: 6,
    featuredOnly: false,
    showImages: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const section = await homepageService.getSection(
        "latest-activities"
      );

      if (section?.data) {
        setSettings(section.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const save = async () => {
    try {
      setLoading(true);

      await homepageService.updateSection(
        "latest-activities",
        {
          // cast to any to satisfy differing expected types between
          // the settings object and the service signature
          data: settings as any,
        }
      );

      alert("Latest Activities updated successfully.");
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
        Latest Activities
      </h2>

      <Input
        label="Number of Activities"
        name="count"
        type="number"
        value={settings.count.toString()}
        onChange={(e) =>
          setSettings({
            ...settings,
            count: Number(e.target.value),
          })
        }
      />

      <label className="flex items-center gap-3">

        <input
          type="checkbox"
          checked={settings.featuredOnly}
          onChange={(e) =>
            setSettings({
              ...settings,
              featuredOnly: e.target.checked,
            })
          }
        />

        Show Featured Activities Only

      </label>

      <label className="flex items-center gap-3">

        <input
          type="checkbox"
          checked={settings.showImages}
          onChange={(e) =>
            setSettings({
              ...settings,
              showImages: e.target.checked,
            })
          }
        />

        Display Activity Images

      </label>

      <PrimaryButton
        onClick={save}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Settings"}
      </PrimaryButton>

    </div>
  );
};

export default LatestActivitiesEditor;