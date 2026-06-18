import { redirect } from "next/navigation";

// /admin n'a pas d'écran propre : on redirige vers le tableau de bord admin.
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
