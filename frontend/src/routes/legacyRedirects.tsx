import { Navigate, useParams } from "react-router-dom";

export function RedirectSitesToCompanies() {
  return <Navigate to="/companies" replace />;
}

export function RedirectSiteToCompany() {
  const { siteId } = useParams();
  const mapped = siteId === "gzmico" ? "gmico" : siteId;
  return <Navigate to={`/companies/${mapped}`} replace />;
}

export function RedirectSitePlant() {
  const { siteId, plantId } = useParams();
  const mapped = siteId === "gzmico" ? "gmico" : siteId;
  return <Navigate to={`/companies/${mapped}/plants/${plantId}`} replace />;
}

export function RedirectSiteEquipment() {
  const { siteId, plantId, id } = useParams();
  const mapped = siteId === "gzmico" ? "gmico" : siteId;
  return <Navigate to={`/companies/${mapped}/plants/${plantId}/equipment/${id}`} replace />;
}
