import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import HomepageEditor from "../../components/admin/homepage/HomepageEditor";

const Homepage = () => {
  return (
    <AdminLayout>

      <PageHeader
        title="Homepage CMS"
        subtitle="Manage Homepage Content"
      />

      <HomepageEditor />

    </AdminLayout>
  );
};

export default Homepage;