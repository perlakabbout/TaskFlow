import Link from "next/link";

type ProjectCardProps = {
  id: number;
  name: string;
  description: string;
};

export default function ProjectCard({
  id,
  name,
  description,
}: ProjectCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>

      <Link href={`/projects/${id}`}>
        View Details
      </Link>
    </div>
  );
}