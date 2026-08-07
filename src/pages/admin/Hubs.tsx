import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../services/config";
import AdminLayout from "../../components/admin/AdminLayout";

interface Hub {
  id: number;
  name: string;
  coordinator?: string;
  province: {
    name: string;
  };
}

const Hubs = () => {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [hero, setHero] = useState({ title: "", subtitle: "", image: "" });
  const [savingHero, setSavingHero] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/homepage/hubs-hero`)
      .then((res) => res.json())
      .then((data) => {
        const h = data?.data || data;
        if (h && typeof h === "object") {
          setHero({ title: h.title || "", subtitle: h.subtitle || "", image: h.image || "" });
        }
      })
      .catch(() => {});
  }, []);

  const saveHero = async () => {
    try {
      setSavingHero(true);
      const token =
        localStorage.getItem("fpi_admin_token") ||
        sessionStorage.getItem("fpi_admin_token");
      await fetch(`${API_BASE_URL}/homepage/hubs-hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(hero),
      });
      alert("Hubs hero saved.");
    } catch (e) {
      console.error(e);
      alert("Unable to save hero.");
    } finally {
      setSavingHero(false);
    }
  };

  const deleteHub = async (id: number) => {
  const confirmDelete = window.confirm(
    "Delete this hub?"
  );

  if (!confirmDelete) return;

  try {
    await fetch(
      `${API_BASE_URL}/hubs/${id}`,
      {
        method: "DELETE",
      }
    );

    setHubs(
      hubs.filter((hub) => hub.id !== id)
    );
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetch(`${API_BASE_URL}/hubs`)
      .then((res) => res.json())
      .then((data) => setHubs(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          MIL Hubs
        </h1>

        <Link
        to="/admin/hubs/create"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        >
        Add Hub
        </Link>
      </div>

      {/* Hub page hero editor */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Hubs Page Hero</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Hero Title</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              placeholder="Our MIL Hubs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Hero Subtitle</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              rows={2}
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              placeholder="Community hubs advancing media and information literacy across Zambia."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Hero Background Image URL
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={hero.image}
              onChange={(e) => setHero({ ...hero, image: e.target.value })}
              placeholder="/images/KL8A3616-1-scaled.jpg"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank to use the default photo. You can use any image path from the site.
            </p>
          </div>
          <button
            onClick={saveHero}
            disabled={savingHero}
            className="bg-[#C9293A] text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            {savingHero ? "Saving..." : "Save Hero"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
<thead>
  <tr className="border-b bg-gray-50">
    <th className="p-3 text-left">Hub</th>
    <th className="p-3 text-left">Province</th>
    <th className="p-3 text-left">Coordinator</th>
    <th className="p-3 text-left">Actions</th>
  </tr>
</thead>

<tbody>
  {hubs.map((hub) => (
    <tr key={hub.id} className="border-b">
      <td className="p-3">{hub.name}</td>

      <td className="p-3">
        {hub.province?.name}
      </td>

      <td className="p-3">
        {hub.coordinator}
      </td>

      <td className="p-3 flex gap-2">
        <Link
          to={`/admin/hubs/${hub.id}/edit`}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </Link>

        <button
          className="bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => deleteHub(hub.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>

        {hubs.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No hubs found
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Hubs;
