"use client";

import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Textarea } from "../../ui/textarea";

type TextAreaWithLabelProps = ComponentProps<typeof Textarea> & {
  label: string;
  isRequired?: boolean;
};

type InputWithLabelProps = ComponentProps<typeof Input> & {
  label: string;
  isRequired?: boolean;
};

export function InputWithLabel({ label, isRequired, ...inputProps }: InputWithLabelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full gap-1">
      <Label htmlFor={inputProps.id}>
        {label}
        {isRequired && <span className="text-honey-brown">{t("common:requiredMarker")}</span>}
      </Label>
      <Input maxLength={200} {...inputProps} />
    </div>
  );
}

export function TextAreaWithLabel({ label, isRequired, ...inputProps }: TextAreaWithLabelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full gap-1">
      <Label htmlFor={inputProps.id}>
        {label}
        {isRequired && <span className="text-honey-brown">{t("common:requiredMarker")}</span>}
      </Label>
      <Textarea maxLength={2000} {...inputProps} />
    </div>
  );
}