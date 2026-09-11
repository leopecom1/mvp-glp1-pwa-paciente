import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kodevant Paciente",
    short_name: "Paciente",
    description:
      "PWA paciente GLP-1/GIP. Facilita el registro y la comunicación con la clínica.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F3EB",
    theme_color: "#F8F3EB",
    lang: "es",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
