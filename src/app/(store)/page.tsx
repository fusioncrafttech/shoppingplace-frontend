import type { Metadata } from "next";
import HomeView from "@/components/store/HomeView";

export const metadata: Metadata = {
  title: "Good finds, all in one place",
};

export default function HomePage() {
  return <HomeView />;
}
