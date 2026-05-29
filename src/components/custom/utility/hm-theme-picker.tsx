"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { mutedColors } from "@/lib/colors";
import { AccentColourContext } from "@/lib/contexts";
import { Moon, Paintbrush, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SliderPicker } from "react-color";

export function ThemePicker() {
  const { t } = useTranslation();
  const theme = useTheme();
  const accentColourContext = useContext(AccentColourContext);
  const [isOpen, setIsOpen] = useState(false);

  function toggleTheme() {
    theme.setTheme(theme.theme === "dark" ? "light" : "dark");
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="gap-4 w-auto">
          <DialogHeader>
            <DialogTitle>{t("settings:theme.pickTheme")}</DialogTitle>
          </DialogHeader>

          <Toggle onClick={toggleTheme} variant="outline" className="mr-auto">
            {theme.theme === "dark" ? <><Moon /> {t("settings:theme.dark")}</> : <><Sun /> {t("settings:theme.light")}</>}
          </Toggle>

          <Field className="w-64"> 
            <FieldLabel>{t("settings:theme.accentColour")}</FieldLabel>
            <SliderPicker
              color={accentColourContext?.accentColour ?? undefined}
              onChange={(color) => accentColourContext?.setAccentColour(color.hex)}
            />
          <Button variant="outline" onClick={() => accentColourContext?.setAccentColour(null)}>
            {t("settings:theme.resetAccentColour")}
          </Button>
          </Field>
        </DialogContent>
      </Dialog>
      
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Paintbrush style={{color: accentColourContext?.accentColour ?? mutedColors.honeyBrown}} />
        {t("settings:theme.changeTheme")}
      </Button>
    </div>
  );
}