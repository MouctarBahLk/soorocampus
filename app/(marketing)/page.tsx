import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Sooro Campus – Accompagnement Campus France",
  description: "Guides, modèles et coaching pour réussir ton projet Campus France.",
};

export default function Page() {
  return <HomeClient />;
}
