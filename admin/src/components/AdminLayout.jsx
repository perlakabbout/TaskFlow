import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  return (
    <div>
      <Sidebar />

      <main>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;