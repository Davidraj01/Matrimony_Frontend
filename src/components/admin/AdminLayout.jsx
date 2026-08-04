import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex w-full min-h-screen overflow-x-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 w-full md:ml-64 pt-16 md:pt-6 p-3 sm:p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
}
