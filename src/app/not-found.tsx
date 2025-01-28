// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
        <p className="mt-4 text-lg text-gray-600">
          The page you are looking for does not exist. Maybe you can try one of the links below:
        </p>
        <div className="mt-8 space-x-4">
          <Link
            href="/"
            className="inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Home
          </Link>
          <Link
            href="/Login"
            className="inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            href="/contact-us"
            className="inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}