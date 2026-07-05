import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../core/auth/AuthContext";
import Logo from "../components/Logo";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const companyId = params.get("company") || "gmico";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      await login(username, password, companyId);
      navigate(`/companies/${companyId}/dashboard`);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="glass-card login-card">
        <Logo className="login-logo" />
        <h2>{t("login.title")}</h2>
        <p className="page-subtitle">{t("login.subtitle")}</p>
        <form onSubmit={onSubmit} className="login-form">
          <label>
            {t("login.username")}
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </label>
          <label>
            {t("login.password")}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <div className="form-error">{t("login.error")}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t("common.loading") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
