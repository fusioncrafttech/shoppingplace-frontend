import type { Metadata } from "next";
import AccountView from "@/components/store/AccountView";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return <AccountView />;
}
