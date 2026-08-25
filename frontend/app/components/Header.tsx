import Link from "next/link";

export default function Header() {
  return (
    <header>
      <h2>TaskFlow</h2>

      <nav>
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/tasks">Tasks</Link>
      </nav>
    </header>
  );
}