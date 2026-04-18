import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { mutedColors } from "@/lib/colors";
import { AccentColourContext } from "@/lib/contexts";
import { Moon, Paintbrush, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useContext, useState } from "react";
import { SliderPicker } from "react-color";

export function ThemePicker() {
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
            <DialogTitle>Pick a theme</DialogTitle>
          </DialogHeader>

          <Toggle onClick={toggleTheme} variant="outline" className="mr-auto">
            {theme.theme === "dark" ? <><Moon /> Dark</> : <><Sun /> Light</>}
          </Toggle>

          <Field className="w-64"> 
            <FieldLabel>Accent colour</FieldLabel>
            <SliderPicker
              color={accentColourContext?.accentColour ?? undefined}
              onChange={(color) => accentColourContext?.setAccentColour(color.hex)}
            />
          <Button variant="outline" onClick={() => accentColourContext?.setAccentColour(null)}>
            Reset accent colour
          </Button>
          </Field>
        </DialogContent>
      </Dialog>
      
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Paintbrush style={{color: accentColourContext?.accentColour ?? mutedColors.honeyBrown}} />
        Change theme
      </Button>
    </div>
  );
}