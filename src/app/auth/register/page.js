"use client";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Rejestracja przez API
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      // Po rejestracji, logowanie
      await login({ email, password });
      router.push("/equipment");
    } catch (err) {
      setError(err.response?.data?.message || "Błąd rejestracji");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Rejestracja</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <Input label="Imię" value={firstName} onChange={setFirstName} />
      <Input label="Nazwisko" value={lastName} onChange={setLastName} />
      <Input label="Email" value={email} onChange={setEmail} />
      <Input
        label="Hasło"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <Button type="submit" className="w-full">
        Zarejestruj się
      </Button>
      <p className="mt-4 text-center">
        Masz konto?{" "}
        <a href="/auth/login" className="text-blue-600 hover:underline">
          Zaloguj się
        </a>
      </p>
    </form>
  );
}
