import { useEffect, useState } from "react";
import Input from "../Input";
import PrimaryButton from "../PrimaryButton";
import { homepageService } from "../../../services/homepageService";

interface Statistic {
  title: string;
  value: string;
}

const StatisticsEditor = () => {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const section = await homepageService.getSection("statistics");

      if (section?.data) {
        setStatistics(section.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addStatistic = () => {
    setStatistics([
      ...statistics,
      {
        title: "",
        value: "",
      },
    ]);
  };

  const removeStatistic = (index: number) => {
    const copy = [...statistics];
    copy.splice(index, 1);
    setStatistics(copy);
  };

  const update = (
    index: number,
    field: keyof Statistic,
    value: string
  ) => {
    const copy = [...statistics];
    copy[index][field] = value;
    setStatistics(copy);
  };

  const save = async () => {
    try {
      setLoading(true);

      await homepageService.updateSection("statistics", {
        data: statistics,
      });

      alert("Statistics saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Unable to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          Homepage Statistics
        </h2>

        <PrimaryButton onClick={addStatistic}>
          Add Statistic
        </PrimaryButton>

      </div>

      {statistics.map((stat, index) => (

        <div
          key={index}
          className="border rounded-xl p-6 space-y-4"
        >

          <Input
            label="Title"
            name={`title-${index}`}
            value={stat.title}
            onChange={(e) =>
              update(index, "title", e.target.value)
            }
          />

          <Input
            label="Value"
            name={`value-${index}`}
            value={stat.value}
            onChange={(e) =>
              update(index, "value", e.target.value)
            }
          />

          <button
            onClick={() => removeStatistic(index)}
            className="text-red-600 font-medium"
          >
            Delete
          </button>

        </div>

      ))}

      <PrimaryButton
        onClick={save}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Statistics"}
      </PrimaryButton>

    </div>
  );
};

export default StatisticsEditor;