import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import { getAssetUrl } from "../../services/config";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import PrimaryButton from "../../components/admin/PrimaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import Badge from "../../components/admin/Badge";

import SearchBar from "../../components/admin/common/SearchBar";
import DataTable from "../../components/admin/common/DataTable";

import { activityService } from "../../services/activityService";
import { Activity } from "../../types/activity";

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data =
        await activityService.getAll();

      setActivities(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const remove = async (id: number) => {

    if (
      !window.confirm(
        "Delete this activity?"
      )
    )
      return;

    await activityService.remove(id);

    loadActivities();
  };

  const filtered = useMemo(() => {
    return activities.filter((activity) =>
      activity.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [activities, search]);

  if (loading)
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );

  return (
    <AdminLayout>

      <PageHeader
        title="Activities"
        subtitle="Manage FPI Zambia activities"
      />

      <PageCard>

        <div className="flex justify-between mb-6">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search activity..."
          />

          <Link to="/admin/activities/create">

            <PrimaryButton>

              <Plus
                size={18}
                className="mr-2"
              />

              Create Activity

            </PrimaryButton>

          </Link>

        </div>

        {filtered.length === 0 ? (

          <EmptyState
            title="No Activities"
            description="Create your first activity."
            buttonText="Create Activity"
            buttonLink="/admin/activities/create"
          />

        ) : (

          <DataTable<Activity>

            data={filtered}

            columns={[

              {
                key: "image",
                title: "Image",
                render: (activity) => (

                  <img
                    src={getAssetUrl(activity.image)}
                    alt={activity.title}
                    className="w-20 h-16 rounded-lg object-cover"
                  />

                ),
              },

              {
                key: "title",
                title: "Title",
              },

              {
                key: "category",
                title: "Category",
              },

              {
                key: "location",
                title: "Province",
              },

              {
                key: "published",
                title: "Status",
                render: (activity) => (

                  <Badge
                    status={
                      activity.published
                        ? "published"
                        : "draft"
                    }
                  />

                ),
              },

              {
                key: "actions",
                title: "Actions",

                render: (activity) => (

                  <div className="flex gap-2">

                    <Link
                      to={`/activities/${activity.id}`}
                    >
                      <Eye size={18} />
                    </Link>

                    <Link
                      to={`/admin/activities/${activity.id}/edit`}
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      onClick={() =>
                        remove(activity.id)
                      }
                    >
                      <Trash2
                        size={18}
                        className="text-red-600"
                      />
                    </button>

                  </div>

                ),
              },

            ]}

          />

        )}

      </PageCard>

    </AdminLayout>
  );
};

export default Activities;
