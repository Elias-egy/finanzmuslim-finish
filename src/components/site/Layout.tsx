import type { ReactNode } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <main className="flex-1">{children}</main>
    <SiteFooter />
  </div>
);

export default Layout;
