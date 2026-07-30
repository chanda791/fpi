import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../services/config";
import BackButton from "../../../components/BackButton";

interface Hub {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coordinator?: string;
  location?: string;
  participants?: number;
  image?: string;
  province: {
    name: string;
  };
}

const ProvinceHubs = () => {
  const { province } = useParams();

  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/hubs`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = Array.isArray(data)
          ? data.filter(
              (hub: Hub) =>
                hub.province?.name?.toLowerCase() ===
                province?.toLowerCase()
            )
          : [];

        setHubs(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [province]);

  if (loading) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        <BackButton
          fallback="/mil/hubs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C9293A] font-medium text-sm mb-8 transition"
        />

        <h1 className="text-5xl font-bold mb-4">
          {province?.charAt(0).toUpperCase()}
          {province?.slice(1)} Province MIL Hubs
        </h1>

        <p className="text-gray-600 text-lg mb-12">
          Media and Information Literacy hubs operating across this province.
        </p>

        {hubs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h3 className="text-2xl font-bold mb-3">
              No hubs found
            </h3>

            <p className="text-gray-500">
              No hubs have been added for this province yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {hubs.map((hub) => (
              <Link
                key={hub.id}
                to={`/mil/hub/${hub.slug}`}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 block overflow-hidden"
              >
                <div className="h-44 bg-gray-100">
                  <img
                    src={hub.image || "/images/activity-1.jpg"}
                    alt={hub.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">
                    {hub.name}
                  </h3>

                  <p className="text-blue-600 mb-2">
                    📍 {hub.location || "Location not available"}
                  </p>

                  <p className="text-gray-600 mb-4">
                    {hub.description ||
                      "Community Media and Information Literacy Hub"}
                  </p>

                  <div className="border-t pt-4 mt-4 flex justify-between text-sm text-gray-500">
                    <span>
                      👤 {hub.coordinator || "TBD"}
                    </span>

                    <span>
                      👥 {hub.participants || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default ProvinceHubs;
