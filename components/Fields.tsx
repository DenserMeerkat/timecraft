"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/lib/AppStateContext";
import CustomInput from "./common/CustomInput";
import { Toggle } from "@/components/ui/toggle";

import { Unlock, Lock } from "lucide-react";
import TooltipElement from "./common/TooltipElement";
import { FieldSkeleton } from "./skeleton/FieldSekelton";
const Test = () => {
  const [isDomLoaded, setIsDomLoaded] = useState(false);
  const state = useAppContext();
  const { hours, days, lock, updateHours, updateDays, updateLock } = state;
  useEffect(() => {
    setTimeout(() => {
      setIsDomLoaded(true);
    }, 1000);
  }, [isDomLoaded]);
  if (!isDomLoaded) return <FieldSkeleton />;
  return (
    <div className="mx-auto max-w-[16rem] h-12 flex items-center">
      <CustomInput
        disabled={lock}
        defaultVal={days}
        direction={"l"}
        suffix={"Day(s)"}
        updateContext={updateDays}
      />
      <CustomInput
        disabled={lock}
        defaultVal={hours}
        direction={"r"}
        suffix={"Hour(s)"}
        updateContext={updateHours}
      />
      <Toggle
        disabled={hours == 0 || days == 0}
        onClick={updateLock}
        className="ml-2 h-[2.6rem] w-12"
        pressed={lock}
      >
        {!lock ? (
          <TooltipElement
            element={<Unlock className="h-8 w-4" />}
            tooltip={"Lock"}
            side={"right"}
          />
        ) : (
          <TooltipElement
            element={<Lock className="h-8 w-4" />}
            tooltip={"Unlock"}
            side={"right"}
          />
        )}
      </Toggle>
    </div>
  );
};

export default Test;
