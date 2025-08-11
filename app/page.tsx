import ProtectedLayout from "./(protected)/layout";
import DashboardPage from "./(protected)/page";

export default function Home() {
  return (
    <ProtectedLayout>
      {/* Dashboard */}
      {/* @ts-expect-error Async Server Component type */}
      <DashboardPage />
    </ProtectedLayout>
  );
}
