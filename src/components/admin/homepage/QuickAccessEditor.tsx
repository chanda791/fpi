import { useEffect, useState } from "react";

import Input from "../Input";
import PrimaryButton from "../PrimaryButton";
import { homepageService } from "../../../services/homepageService";

interface QuickAccessItem {
  title: string;
  description: string;
  link: string;
}

const QuickAccessEditor = () => {
  const [items, setItems] = useState<QuickAccessItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const section = await homepageService.getSection("quick-access");

      if (section?.data) {
        setItems(section.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const update = (
    index: number,
    field: keyof QuickAccessItem,
    value: string
  ) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        title: "",
        description: "",
        link: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const copy = [...items];
    copy.splice(index, 1);
    setItems(copy);
  };

  const save = async () => {
    try {
      setLoading(true);

      await homepageService.updateSection("quick-access", {
        data: items as unknown as number[],
      });

      alert("Quick Access updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          Quick Access
        </h2>

        <PrimaryButton onClick={addItem}>
          Add Card
        </PrimaryButton>

      </div>

      {items.map((item, index) => (

        <div
          key={index}
          className="border rounded-xl p-6 space-y-4"
        >

          <Input
            label="Title"
            name={`title-${index}`}
            value={item.title}
            onChange={(e) =>
              update(index, "title", e.target.value)
            }
          />

          <Input
            label="Description"
            name={`description-${index}`}
            value={item.description}
            onChange={(e) =>
              update(index, "description", e.target.value)
            }
          />

          <Input
            label="Link"
            name={`link-${index}`}
            value={item.link}
            onChange={(e) =>
              update(index, "link", e.target.value)
            }
          />

          <button
            onClick={() => removeItem(index)}
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
        {loading ? "Saving..." : "Save Quick Access"}
      </PrimaryButton>

    </div>
  );
};

export default QuickAccessEditor;