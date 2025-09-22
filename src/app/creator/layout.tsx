
import Link from "next/link";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold">DropX Creator</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
       <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DropX India. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
