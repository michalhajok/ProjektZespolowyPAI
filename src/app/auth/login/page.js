"use client";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push("/equipment");
    } catch (err) {
      setError(err.response?.data?.message || "Błąd logowania");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Logowanie</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <Input label="Email" value={email} onChange={setEmail} />
      <Input
        label="Hasło"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <Button type="submit" className="w-full">
        Zaloguj się
      </Button>
      <p className="mt-4 text-center">
        Nie masz konta?{" "}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Zarejestruj się
        </a>
      </p>
    </form>
  );
}
