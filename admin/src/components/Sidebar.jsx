import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div>
      <h2>TaskFlow</h2>

      <nav>
        <p>
          <Link to="/dashboard">Dashboard</Link>
        </p>

        <p>
          <Link to="/projects">Projects</Link>
        </p>

        <p>
          <Link to="/tasks">Tasks</Link>
        </p>
      </nav>
    </div>
  );
}

export default Sidebar;