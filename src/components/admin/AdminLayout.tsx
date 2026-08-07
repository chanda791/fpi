import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Header />

        <main className="p-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;