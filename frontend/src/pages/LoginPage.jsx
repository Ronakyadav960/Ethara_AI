import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthFormLayout from "../components/AuthFormLayout";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, loading, token } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const result = await login(formData);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <AuthFormLayout
      title="Welcome back"
      subtitle="Sign in to manage projects and keep delivery visible."
      footerText="Need an account?"
      footerLink="/signup"
      footerLabel="Create one"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="input"
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="button-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;
