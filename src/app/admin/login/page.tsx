import type { Metadata } from "next";
import { assets } from "@/components/sites/showlanka/config";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="adm-login">
      <div className="adm-card adm-login__card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.logo} alt="Show Lanka Tours" />
        <h1>Admin panel</h1>
        <p>Sign in to see enquiries and traffic.</p>
        <LoginForm />
      </div>
    </main>
  );
}
