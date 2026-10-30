import Link from "next/link";
import { Shield } from "lucide-react";
import { CyberPlusLogo } from "@/components/ui/logo";

const footerLinks = {
  Product: [
    { name: "How it works", href: "/product" },
    { name: "Pricing", href: "/pricing" },
    { name: "Developers", href: "/developers" },
    { name: "Solutions", href: "/solutions" },
  ],
  Resources: [
    { name: "Articles", href: "/resources" },
    { name: "Glossary", href: "/resources/glossary" },
    { name: "FAQ", href: "/support" },
    { name: "Support", href: "/support" },
  ],
  Legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Security", href: "/security" },
    { name: "How the prototype works", href: "/how-the-prototype-works" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#e2e2e2] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 group">
              <CyberPlusLogo size={28} className="h-7 w-7" />
              <span className="text-base font-bold tracking-tight text-[#171a20]">
                Cyber<span className="text-[#3e6ae1]">Plus</span>
              </span>
            </Link>
            <p className="text-sm text-[#5c5e62] mb-3">
              Proving you are a human
            </p>
            <p className="text-xs text-[#8e8e93]">
              contact@cyberplus.id
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5c5e62] mb-3.5">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#393c41] hover:text-[#171a20] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#e2e2e2] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8e8e93]">
          <p>
            &copy; {new Date().getFullYear()} CyberPlus Inc. Early-stage prototype &mdash; not a production identity system.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#171a20] transition-colors">Privacy &amp; Legal</Link>
            <Link href="/terms" className="hover:text-[#171a20] transition-colors">Terms</Link>
            <Link href="/security" className="hover:text-[#171a20] transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
