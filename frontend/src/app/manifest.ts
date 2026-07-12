import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dwellix Home Management",
    short_name: "Dwellix",
    description: "Your Home. Smarter Every Day.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#E85D3F",
    icons: [
      {
        src: "/logo/dwellix-logo-light.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
