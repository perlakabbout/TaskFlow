import Link from "next/link";

export default function Home() {
  return (
    <section>
      <h1>Welcome to TaskFlow</h1>

      <p>
        Organize projects, manage tasks, and keep track of your work
        in one simple place.
      </p>

      <Link href="/projects">View Projects</Link>
    </section>
  );
}