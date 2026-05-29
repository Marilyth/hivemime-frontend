"use client";

import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div>
      {t("common:aboutGreeting")}
    </div>
  );
}
