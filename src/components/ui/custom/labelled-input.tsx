import { Label } from "../label";
import { Input } from "../input";
import { ComponentProps } from "react";
import { Textarea } from "../textarea";

type TextAreaWithLabelProps = ComponentProps<typeof Textarea> & {
  label: string;
  isRequired?: boolean;
};

type InputWithLabelProps = ComponentProps<typeof Input> & {
  label: string;
  isRequired?: boolean;
};

export function InputWithLabel({ label, isRequired, ...inputProps }: InputWithLabelProps) {
  return (
    <div className="flex flex-col w-full gap-1">
      <Label htmlFor={inputProps.id}>
        {label}
        {isRequired && <span className="text-honey-brown">*</span>}
      </Label>
      <Input maxLength={200} {...inputProps} />
    </div>
  );
}

export function TextAreaWithLabel({ label, isRequired, ...inputProps }: TextAreaWithLabelProps) {
  return (
    <div className="flex flex-col w-full gap-1">
      <Label htmlFor={inputProps.id}>
        {label}
        {isRequired && <span className="text-honey-brown">*</span>}
      </Label>
      <Textarea maxLength={2000} {...inputProps} />
    </div>
  );
}