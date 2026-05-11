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

  includedAirline: string[];
  setIncludedAirline: (v: string[]) => void;

  excludedAirline: string[];
  setExcludedAirline: (v: string[]) => void;

  minPrice: number;
  setMinPrice: (n: number) => void;

  maxPrice: number;
  setMaxPrice: (n: number) => void;

  nonstopOnly: boolean;
  setNonstopOnly: (v: boolean) => void;

  tripLength: number;
  setTripLength: (n: number) => void;

  departureWindow: number;
  setDepartureWindow: (n: number) => void;
  returnWindow: number;
  setReturnWindow: (n: number) => void;
};

export default function AdvancedOptionsComponent({
  advancedOpen,
  setAdvancedOpen,
  includedAirline,
  setIncludedAirline,
  excludedAirline,
  setExcludedAirline,
  minPrice,
  setMinPrice,
  nonstopOnly,
  setNonstopOnly,
  maxPrice,
  setMaxPrice,
  tripLength,
  setTripLength,
  departureWindow,
  setDepartureWindow,
  returnWindow, 
  setReturnWindow
  
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
            Included airlines
            <Input
                    value={includedAirline.join(", ")}
                    onChange={(e) =>
                    setIncludedAirline(
                    e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                )
            }

              placeholder="UA, DL, AA"
              className="mt-1"
            />
          </div>
          <div className="text-sm font-medium text-black-600">
                Excluded airlines
                <Input
                    value={excludedAirline.join(", ")}
                    onChange={(e) =>
                    setExcludedAirline(
                    e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                )
            }

                className="mt-1"
                />
          </div>
          <div className="text-sm font-medium text-black-600">
                <div>
                    Trip Length (under {tripLength} hours)
                </div>
                
                <Slider
                    min={0}
                    max={64}
                    step={1}
                    value={[tripLength]}
                    onValueChange={(vals) => {
                        setTripLength(vals[0] ?? 1);
                    }}
                    className="mt-2"
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

          <div className="text-sm font-medium text-black-600">
            Departure window: {departureWindow}
            <Slider
                min={0}
                max={3}
                step={1}
                value={[departureWindow]}
                onValueChange={(vals) => setDepartureWindow(vals[0] ?? 0)}
            />
          </div>
          <div>
            Return window: {returnWindow}
            <Slider
                min={0}
                max={3}
                step={1}
                onValueChange={(vals) => setReturnWindow(vals[0] ?? 0)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={nonstopOnly}
              onCheckedChange={(checked) => setNonstopOnly(!!checked)}
            />
            <p className="text-sm font-medium">Nonstop only</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIncludedAirline([]);
                setNonstopOnly(false);
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
