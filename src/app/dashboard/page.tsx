import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import RoleSelector from "@/components/Dashboard/RoleSelector";
import QuickActions from "@/components/Dashboard/QuickActions";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoleSelector />
        <QuickActions />
      </div>
    </div>
  );
}
