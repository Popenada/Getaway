"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;
type AdvancedOptionsComponentProps = {
  advancedOpen: boolean;
  setAdvancedOpen: (v: boolean) => void;

  preferredAirline: string;
  setPreferredAirline: (t: string) => void;

  minPrice: number;
  setMinPrice: (n: number) => void;

  maxPrice: number;
  setMaxPrice: (n: number) => void;

  nonStopOnly: boolean;
  setNonStopOnly: (v: boolean) => void;
};

export default function AdvancedOptionsComponent({
  advancedOpen,
  setAdvancedOpen,
  preferredAirline,
  setPreferredAirline,
  minPrice,
  setMinPrice,
  nonStopOnly,
  setNonStopOnly,
  maxPrice,
  setMaxPrice,
}: AdvancedOptionsComponentProps) {
  return (
    <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="w-full">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-black-600">Advanced options</div>

        <CollapsibleTrigger asChild>
          <Button variant="outline" className="h-9 px-3">
            {advancedOpen ? "Hide" : "Show"}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="mt-4">
        <div className="border rounded-md p-4 flex flex-col gap-4">
          <div className="text-sm font-medium text-black-600">
            Preferred airline
            <Input
              value={preferredAirline}
              onChange={(e) => setPreferredAirline(e.target.value)}
              placeholder="UA, DL, AA"
              className="mt-1"
            />
          </div>

          <div className="text-sm font-medium text-black-600">
            <div className="text-sm font-medium text-black-600">
            Price range (${minPrice} – ${maxPrice})
            </div>

            <Slider
                min={0}
                max={2000}
                step={25}
                value={[minPrice, maxPrice]}
                onValueChange={(vals) => {
                    setMinPrice(vals[0]);
                    setMaxPrice(vals[1]);
                }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={nonStopOnly}
              onCheckedChange={(checked) => setNonStopOnly(!!checked)}
            />
            <p className="text-sm font-medium">Nonstop only</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setPreferredAirline("");
                setNonStopOnly(false);
                setMinPrice(DEFAULT_MIN_PRICE);
                setMaxPrice(DEFAULT_MAX_PRICE);
              }}
            >
              Reset
            </Button>

            <Button variant="secondary" onClick={() => setAdvancedOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
