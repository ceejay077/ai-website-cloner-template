import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { assets } from "@/components/sites/showlanka/config";
import { requireAdmin } from "@/lib/server/auth";
import { countEnquiriesByStatus } from "@/lib/server/store";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const email = await requireAdmin();
  const newCount = countEnquiriesByStatus().new;

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <Link href="/admin" className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assets.logo} alt="" />
          <span>
            Show Lanka
            <small>Admin panel</small>
          </span>
        </Link>
        <AdminNav newCount={newCount} />
        <div className="adm-side-foot">
          <span title={email} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {email}
          </span>
          <form action={logout}>
            <button className="adm-btn adm-btn--ghost" type="submit">
              <LogOut size={16} aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
