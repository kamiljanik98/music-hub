export type Props = {
  title: string;
  description: string;
  subpoints: string[];
};

export const ONBOARDING_DATA: Props[] = [
  {
    title: "Access Credentials",
    description: "Use the following credentials to log in and explore the app:",
    subpoints: ["Email: guest@mail.com", "Password: open"],
  },
  {
    title: "About Music Hub",
    description:
      "Music Hub is your ultimate music companion. Upload, organize, and explore your personal audio collection seamlessly. Designed for both casual listeners and professional creators, it makes managing and sharing your music effortless.",
    subpoints: [
      "Centralized audio library for all your files",
      "Intuitive dashboard with quick access",
    ],
  },
];

// export const ONBOARDING_DATA: Props[] = [
//   {
//     title: "Welcome to Music Hub",
//     description:
//       "Your ultimate music companion. Easily upload, organize, and explore your personal audio collection in one seamless platform. Whether you're a casual listener or a professional creator, Music Hub empowers you to connect with your sound like never before.",
//     subpoints: [
//       "Centralized audio library for all your files",
//       "Personalized dashboard with quick access",
//       "Connect with a vibrant community of creators",
//     ],
//   },
//   {
//     title: "Upload & Organize Your Tracks",
//     description:
//       "Quickly upload your beats, loops, or full tracks with our intuitive drag-and-drop system. Organize your music with flexible tags and smart folders to keep your creative workflow smooth and efficient.",
//     subpoints: [
//       "Effortless drag-and-drop uploads",
//       "Advanced tagging and metadata management",
//       "Auto-generated waveform previews for easy navigation",
//     ],
//   },
//   {
//     title: "Discover Curated Content",
//     description:
//       "Explore daily updated playlists, trending audio loops, and handpicked tracks from creators worldwide. Discover new inspirations and expand your musical horizons effortlessly.",
//     subpoints: [
//       "Fresh daily charts to keep you updated",
//       "Featured loops and stems selected by experts",
//       "Follow your favorite creators and get notified",
//     ],
//   },
//   {
//     title: "Collaborate & Share Seamlessly",
//     description:
//       "Create private or public collections, invite collaborators, and share your work with customizable access controls. Get real-time feedback and grow your audience with ease.",
//     subpoints: [
//       "Invite-only collections for team projects",
//       "Shareable links with configurable permissions",
//       "Integrated feedback system for community interaction",
//     ],
//   },
// ];
