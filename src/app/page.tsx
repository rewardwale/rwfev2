import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1>Hello</h1>
      <Link href="/typography">Typography</Link>
      <Link href="/signup">Signup</Link>
      <Link href="/signin">Sign In</Link>
      <Link href="/reset">Forgot Password ?</Link>
    </main>
  );
}
