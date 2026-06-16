import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ApplyTrackr",
    short_name: "ApplyTrackr",
    description: "Track job applications, follow-ups, resumes, and cover letters.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f3f7fc",
    theme_color: "#0f2f6b",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/app-icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
