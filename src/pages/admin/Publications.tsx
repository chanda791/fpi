import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import PrimaryButton from "../../components/admin/PrimaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import { getAssetUrl } from "../../services/config";

import { publicationService } from "../../services/publicationService";

const Publications = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await publicationService.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!window.confirm("Delete publication?")) return;

    await publicationService.remove(id);

    load();
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <PageHeader
        title="Publications"
        subtitle="Manage publications"
      />

      <PageCard>

        <div className="flex justify-end mb-5">

          <Link to="/admin/publications/create">

            <PrimaryButton>

              <Plus size={18} className="mr-2" />

              New Publication

            </PrimaryButton>

          </Link>

        </div>

        {items.length === 0 ? (

          <EmptyState
            title="No Publications"
            description="Create your first publication."
          />

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Title
                </th>

                <th className="text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item) => (

                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="py-4">

                    {item.title}

                  </td>

                  <td>

                    <div className="flex justify-center gap-3">

                      <a
                        href={getAssetUrl(item.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye size={18} />
                      </a>

                      <Link
                        to={`/admin/publications/${item.id}/edit`}
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => remove(item.id)}
                      >
                        <Trash2
                          size={18}
                          className="text-red-600"
                        />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </PageCard>

    </AdminLayout>
  );
};

export default Publications;