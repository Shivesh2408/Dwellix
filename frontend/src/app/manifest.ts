import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dwellix Home Management",
    short_name: "Dwellix",
    description: "Your Home. Smarter Every Day.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/logo/dwellix-logo-light.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
