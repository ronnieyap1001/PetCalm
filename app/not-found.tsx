import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="font-serif text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-charcoal/70">
        The page you're looking for doesn't exist.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-block">
        Back to home
      </Link>
    </div>
  );
}
