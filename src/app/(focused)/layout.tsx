export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex min-h-screen flex-col">{children}</main>;
}
