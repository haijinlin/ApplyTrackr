import Link from "next/link";
import { BarChart3, BriefcaseBusiness, FilePlus2, Files, LayoutDashboard } from "lucide-react";
import { LogoMark } from "./logo";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/applications/quick-add", label: "Quick Add", icon: FilePlus2 },
  { href: "/versions", label: "Resumes", icon: Files },
  { href: "/performance", label: "Performance", icon: BarChart3 },
];

export function Nav() {
  return (
    <>
      <aside className="sidebar">
        <Link href="/" className="brand">
          <LogoMark />
          <span>ApplyTrackr</span>
        </Link>
        <nav className="nav-list">
          {links.map(({ href, label, icon: Icon }) => (
            <Link href={href} className="nav-link" key={href}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <strong>Stay on top of the pipeline.</strong>
          <span>Review follow-ups and outcomes every morning.</span>
        </div>
      </aside>
      <nav className="mobile-nav">
        {links.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
