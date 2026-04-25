import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { observer } from "mobx-react-lite";
import { userStore } from "@/lib/contexts";
import { reaction } from "mobx";
import { honeyToLevel } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "./ui/progress";

interface LevelBannerProps {
  animationDuration?: number;
  bannerDuration?: number;
}

export const LevelBanner = observer(({ animationDuration = 1500, bannerDuration = 3000 }: LevelBannerProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [honeyGained, setHoneyGained] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  function easeOut(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function setPopup(newHoney: number | undefined, oldHoney: number | undefined) {
    if (newHoney === undefined || oldHoney === undefined || newHoney === oldHoney)
      return;

    const startTime = performance.now();
    
    const honeyGained = newHoney - oldHoney;
    setHoneyGained(0);

    function updateCurrentExpGained(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeOut(progress);
      const easedHoneyGained = honeyGained * easedProgress;
      setHoneyGained(easedHoneyGained);

      const newHoney = oldHoney! + easedHoneyGained;
      const currentLevel = honeyToLevel(newHoney);
      const currentLevelFloor = Math.floor(currentLevel);
      const currentProgress = (currentLevel - currentLevelFloor) * 100;

      setCurrentProgress(currentProgress);
      setCurrentLevel(currentLevelFloor);
      setShowPopup(true);

      if (progress < 1) {
        requestAnimationFrame(updateCurrentExpGained);
      }
    }

    requestAnimationFrame(updateCurrentExpGained);

    setTimeout(() => {
      setShowPopup(false);
    }, bannerDuration);
  }

  useEffect(() => {
    const dispose = reaction(
      () => userStore.user?.honey,
      setPopup
    );

    return () => dispose();
  }, []);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5 } }}
        >
          <Alert className="bg-card">
            <AlertDescription className="flex flex-col gap-2">
              <span>
                You gained <span className="font-bold text-honey-brown">🍯 {honeyGained.toFixed(2)}</span> honey!
              </span>
              <div className="flex flex-row gap-2 text-muted-foreground items-center">
                {currentLevel}
                <Progress className="[&>div]:transition-none" value={currentProgress} />
                {currentLevel + 1}
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
});
