import { Link, useParams } from "react-router-dom";

export default function ComingSoonPage() {
  const { moduleId } = useParams<{ moduleId: string }>();

  return (
    <div className="empty-state">
      <h2 className="page-title" style={{ marginBottom: "0.5rem" }}>
        {moduleId?.replace(/-/g, " ").toUpperCase()}
      </h2>
      <p>This module is planned for a future GoharTwin release.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
        Back to Platform
      </Link>
    </div>
  );
}
