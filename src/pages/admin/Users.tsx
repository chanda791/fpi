import { useEffect, useState } from "react";
import { Plus, Trash2, KeyRound, ShieldCheck } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import PrimaryButton from "../../components/admin/PrimaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import Toggle from "../../components/admin/Toggle";

import { userService, AdminUser } from "../../services/userService";
import { getAuthUser } from "../../services/auth";

const ROLE_OPTIONS = [
  { label: "Super Admin", value: "superadmin" },
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
];

const Users = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = getAuthUser();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "editor",
  });

  const load = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert(
        "Unable to load users. This page requires an administrator account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createUser = async () => {
    if (!form.fullName || !form.email || !form.password) {
      alert("Full name, email, and password are required.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await userService.create(form);
      setForm({ fullName: "", email: "", password: "", role: "editor" });
      setShowForm(false);
      await load();
      alert("User created successfully.");
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Unable to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (user: AdminUser) => {
    try {
      await userService.update(user.id, { active: !user.active });
      await load();
    } catch (error) {
      console.error(error);
      alert("Unable to update user.");
    }
  };

  const changeRole = async (user: AdminUser, role: string) => {
    try {
      await userService.update(user.id, { role });
      await load();
    } catch (error) {
      console.error(error);
      alert("Unable to update role.");
    }
  };

  const resetPassword = async (user: AdminUser) => {
    const password = window.prompt(
      `Enter a new password for ${user.email} (minimum 8 characters):`
    );

    if (!password) return;

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    try {
      await userService.resetPassword(user.id, password);
      alert(`Password updated for ${user.email}.`);
    } catch (error) {
      console.error(error);
      alert("Unable to reset password.");
    }
  };

  const deleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Delete ${user.fullName} (${user.email})?`)) return;

    try {
      await userService.remove(user.id);
      await load();
    } catch (error) {
      console.error(error);
      alert("Unable to delete user.");
    }
  };

  return (
    <AdminLayout>

      <PageHeader
        title="Users"
        subtitle="Manage administrator accounts and access levels"
      />

      <PageCard>

        <div className="flex justify-between items-center mb-8">
          <p className="text-slate-500 text-sm">
            {currentUser?.email ? `Signed in as ${currentUser.email}` : ""}
          </p>

          <PrimaryButton onClick={() => setShowForm((v) => !v)}>
            <Plus size={18} className="mr-2" />
            {showForm ? "Cancel" : "Add User"}
          </PrimaryButton>
        </div>

        {showForm && (
          <div className="mb-8 border rounded-2xl p-6 bg-slate-50 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />

              <Select
                label="Role"
                name="role"
                value={form.role}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <PrimaryButton onClick={createUser} disabled={submitting}>
              {submitting ? "Creating..." : "Create User"}
            </PrimaryButton>
          </div>
        )}

        {loading ? (
          <Loading />
        ) : users.length === 0 ? (
          <EmptyState
            title="No Users"
            description="Create the first additional administrator account."
            buttonText="Add User"
            buttonLink="#"
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                          <ShieldCheck className="text-[#C9293A]" size={18} />
                        </div>
                        <span className="font-semibold">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user, e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-sm"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <Toggle
                        checked={user.active}
                        onChange={() => toggleActive(user)}
                        label="Account"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => resetPassword(user)}
                          className="p-2 rounded-lg bg-amber-100 text-amber-700"
                          title="Reset password"
                        >
                          <KeyRound size={18} />
                        </button>
                        <button
                          onClick={() => deleteUser(user)}
                          className="p-2 rounded-lg bg-red-100 text-red-700"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </PageCard>

    </AdminLayout>
  );
};

export default Users;
