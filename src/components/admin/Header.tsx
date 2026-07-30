import { useNavigate } from "react-router-dom";
import { getAuthUser, logout } from "../../services/auth";

const Header = () => {
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">
        FPI Zambia Admin
      </h2>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          {(user?.fullName || "Administrator").charAt(0).toUpperCase()}
        </div>

        <span>{user?.fullName || "Administrator"}</span>

        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
