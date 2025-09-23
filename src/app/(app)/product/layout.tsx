
// This layout applies only to the product pages, creating a nested layout structure.
// It does not include the main Header or Footer, providing a more focused view.
export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
