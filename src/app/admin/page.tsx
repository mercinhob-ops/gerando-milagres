import type { Metadata } from "next";
import { AdminContent } from "./admin-content";

export const metadata: Metadata = {
  title: "Admin — Leads",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminContent />;
}
