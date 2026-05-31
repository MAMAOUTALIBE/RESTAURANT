"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type ActionState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
      {pending ? "Envoi…" : "Recevoir mon lien de connexion"}
    </button>
  );
}

/** Formulaire de connexion par lien magique (email vérifié). */
export function LoginForm({ initialError }: { initialError?: boolean }) {
  const [state, formAction] = useFormState<ActionState | null, FormData>(
    login,
    null,
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-cream/80">
          Votre email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-cream placeholder:text-muted focus:border-gold/60 focus:outline-none"
        />
      </div>
      {state && (
        <p
          role="status"
          className={`text-sm ${state.ok ? "text-green-400" : "text-red-400"}`}
        >
          {state.message}
        </p>
      )}
      {!state && initialError && (
        <p role="alert" className="text-sm text-red-400">
          Lien invalide ou expiré. Demandez-en un nouveau.
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
