import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import { teamService } from "../../services/teamService";
import { TeamMember } from "../../types/team";

const TeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    try {
      const data = await teamService.getAll();

      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error(error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Team Members
          </h1>
          <p className="text-slate-500 mt-1">
            Manage FPI Zambia leadership and staff.
          </p>
        </div>

        <Link
          to="/admin/team/create"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          + Add Member
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Photo</th>
              <th className="p-4 text-left">Full Name</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-center">Published</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-slate-500"
                >
                  Loading team members...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-slate-500"
                >
                  No team members found.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    <img
                      src={
                        member.image ||
                        "https://via.placeholder.com/60"
                      }
                      alt={member.fullName}
                      className="w-14 h-14 rounded-full object-cover border"
                    />
                  </td>

                  <td className="p-4 font-semibold text-slate-800">
                    {member.fullName}
                  </td>

                  <td className="p-4 text-slate-600">
                    {member.position}
                  </td>

                  <td className="p-4 text-slate-600">
                    {member.category}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.published
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member.published ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/team/${member.id}/edit`}
                        className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      >
                        Edit
                      </Link>

                      <button
                        className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              "Delete this team member?"
                            )
                          )
                            return;

                          try {
                            await teamService.remove(member.id);
                            loadMembers();
                          } catch (error) {
                            console.error(error);
                            alert("Failed to delete member.");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default TeamMembers;