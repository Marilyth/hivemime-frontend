"use client"

import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { logInWithEmailPassword, createWithEmailPassword, logInWithGoogle } from "@/lib/firebase";
import { SiGoogle } from "react-icons/si";
import { AsyncButton } from "../utility/async-button";
import { userStore } from "@/lib/contexts";
import { useTranslation } from "react-i18next";

export function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function logInUsingGoogle() {
    await logInWithGoogle();
    userStore.setUser(null);
  }

  async function logInUsingEmail() {
    try {
      await logInWithEmailPassword(email, password);
    } catch (error) {
      await createWithEmailPassword(email, password);
    }
    userStore.setUser(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Integrations with SSO services */}
        <AsyncButton variant="outline" onClick={logInUsingGoogle}>
          <SiGoogle className="mr-2 text-honey-brown" />
          {t("auth:login.continueWithGoogle")}
        </AsyncButton>

        <div className="flex items-center gap-4 text-muted-foreground">
          <FieldSeparator className="flex-1" />
          <span className="text-sm text-muted-foreground">{t("common:or")}</span>
          <FieldSeparator className="flex-1" />
        </div>

        <Field className="gap-1">
          <FieldLabel htmlFor="email">{t("auth:login.email")}</FieldLabel>
          <Input id="email" autoComplete="email" placeholder={t("auth:login.emailPlaceholder")}
                 value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>

        <Field className="gap-1">
          <FieldLabel htmlFor="password">{t("auth:login.password")}</FieldLabel>
          <Input id="password" type="password" autoComplete="current-password" placeholder={t("auth:login.passwordPlaceholder")}
                 value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>

        <AsyncButton onClick={logInUsingEmail} className="mt-2" disabled={!email || !password}>
          {t("auth:login.submit")}
        </AsyncButton>
      </div>
    </div>
  )
}