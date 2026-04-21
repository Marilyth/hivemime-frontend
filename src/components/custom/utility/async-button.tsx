import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FC, useRef, useState, MouseEvent } from "react";

type AsyncButtonProps = React.ComponentProps<typeof Button> & {
  behaviour?: "enableIfError" | "alwaysEnable" | "disable";
  enableDelay?: number;
}

export const AsyncButton: FC<AsyncButtonProps> = ({ behaviour = "alwaysEnable", enableDelay = 200, onClick, disabled, children, className, ...rest }) => {
  const isLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick(e: MouseEvent<HTMLButtonElement>){
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const response: any = onClick?.(e);

      if (response instanceof Promise)
        await response;
    } catch (error) {
      if (behaviour === "enableIfError")
        await reEnable();
    } finally {
      setIsLoading(false);

      if (behaviour === "alwaysEnable")
        await reEnable();
    }
  }

  async function reEnable() {
    if (enableDelay > 0)
      await new Promise(resolve => setTimeout(resolve, enableDelay));

    isLoadingRef.current = false;
    setIsLoading(false);
  }

  return (
    <Button onClick={handleClick} className={cn(className, isLoading && "relative")} disabled={isLoading || disabled} {...rest}>
      {children}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className="animate-spin" />
        </span>
      )}
    </Button>
  );
}