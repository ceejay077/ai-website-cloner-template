"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action}>
      {state?.error && (
        <p className="adm-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="adm-field">
        <label htmlFor="adm-email">Email</label>
        <input id="adm-email" className="adm-input" name="email" type="email" autoComplete="username" required autoFocus />
      </div>
      <div className="adm-field">
        <label htmlFor="adm-password">Password</label>
        <input id="adm-password" className="adm-input" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
