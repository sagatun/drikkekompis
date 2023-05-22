export const pwaConfig = {
  name: "Drikkekompis🍻",
  short_name: "Drikkekompis🍻",
  theme_color: "#4b5563",
  description: "Din personlige guide til god drikke",
  background_color: "#4b5563",
  display: "standalone",
  start_url: ".",
  icons: [
    {
      src: "./pwa-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "./pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "./pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};
