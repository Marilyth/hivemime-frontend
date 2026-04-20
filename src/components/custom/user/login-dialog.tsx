"use client"

import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { logInWithEmailPassword, createWithEmailPassword, logInWithGoogle } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";
import { UserContext } from "@/lib/contexts";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userContext = useContext(UserContext);

  async function logInUsingGoogle() {
    await logInWithGoogle();
    userContext?.setUser(null);
  }

  async function logInUsingEmail() {
    try {
      await logInWithEmailPassword(email, password);
    } catch (error) {
      await createWithEmailPassword(email, password);
    }
    userContext?.setUser(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Integrations with SSO services */}
        <Button variant="outline" onClick={logInUsingGoogle}>
          <SiGoogle className="mr-2 text-honey-brown" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-4 text-muted-foreground">
          <FieldSeparator className="flex-1" />
          <span className="text-sm text-muted-foreground">OR</span>
          <FieldSeparator className="flex-1" />
        </div>

        <Field className="gap-1">
          <FieldLabel htmlFor="email">E-Mail</FieldLabel>
          <Input id="email" autoComplete="email" placeholder="your-email@example.com"
                 value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>

        <Field className="gap-1">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" autoComplete="current-password" placeholder="•••••••••••"
                 value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>

        <Button onClick={logInUsingEmail} className="mt-2" disabled={!email || !password}>
          Log in / Sign up
        </Button>
      </div>
    </div>
  )
}