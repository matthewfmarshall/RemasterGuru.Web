import { redirect } from "next/navigation";
import { isAuth0Configured } from "@/src/lib/auth/config";
import { auth0 } from "@/src/lib/auth0";

export async function AppAuthGate({ children }: { children: React.ReactNode }) {
  if (isAuth0Configured()) {
    const session = await auth0.getSession();
    if (!session) {
      redirect("/auth/login?returnTo=/app/albums");
    }
  }

  return children;
}
