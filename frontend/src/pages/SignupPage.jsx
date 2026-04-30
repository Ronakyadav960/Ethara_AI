import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthFormLayout from "../components/AuthFormLayout";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const { signup, loading, token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const result = await signup(formData);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <AuthFormLayout
      title="Create your workspace"
      subtitle="Start with an admin or member account and connect your team."
      footerText="Already registered?"
      footerLink="/login"
      footerLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          className="input"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
        />
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
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>
    </AuthFormLayout>
  );
};

export default SignupPage;
