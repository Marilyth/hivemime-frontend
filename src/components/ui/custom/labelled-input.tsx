import { Label } from "../label";
import { Input } from "../input";
import { ComponentProps } from "react";

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
      <Input {...inputProps} />
    </div>
  );
}