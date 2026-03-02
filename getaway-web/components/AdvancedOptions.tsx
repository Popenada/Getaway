"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

function OptionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10px] font-medium tracking-[0.1em] uppercase mb-2 block"
      style={{ color: "#b8b3ad" }}
    >
      {children}
    </span>
  );
}

function OptionField({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col rounded-2xl px-4 py-3"
      style={{ background: "#fdfcf9" }}
    >
      {children}
    </div>
  );
}

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
  setReturnWindow,
}: AdvancedOptionsComponentProps) {
  return (
    <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="w-full">

      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-200 cursor-pointer mt-4"
          style={{ color: advancedOpen ? "#c4714a" : "#6b6560" }}
        >
          <ChevronDown
            size={14}
            className="transition-transform duration-200"
            style={{ transform: advancedOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
          {advancedOpen ? "Hide advanced options" : "Advanced options"}
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div
          className="mt-3 rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: "rgba(232,224,212,0.3)",
            border: "1px solid rgba(26,23,20,0.06)",
          }}
        >

          {/* Airlines row */}
          <div className="grid grid-cols-2 gap-3">
            <OptionField>
              <OptionLabel>Included airlines</OptionLabel>
              <Input
                value={includedAirline.join(", ")}
                onChange={(e) =>
                  setIncludedAirline(
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="UA, DL, AA"
                className="border-0 bg-transparent p-0 h-auto text-[14px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </OptionField>

            <OptionField>
              <OptionLabel>Excluded airlines</OptionLabel>
              <Input
                value={excludedAirline.join(", ")}
                onChange={(e) =>
                  setExcludedAirline(
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="WN, F9"
                className="border-0 bg-transparent p-0 h-auto text-[14px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </OptionField>
          </div>

          <OptionField>
            <OptionLabel>Price range</OptionLabel>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px]" style={{ color: "#1a1714" }}>${minPrice}</span>
              <span className="text-[13px]" style={{ color: "#1a1714" }}>${maxPrice}</span>
            </div>
            <Slider
              min={0}
              max={2000}
              step={25}
              value={[minPrice, maxPrice]}
              onValueChange={(vals) => {
                setMinPrice(vals[0]);
                setMaxPrice(vals[1] ?? DEFAULT_MAX_PRICE);
              }}
              className="[&_[role=slider]]:bg-[#c4714a] [&_[role=slider]]:border-[#c4714a] [&_.range]:bg-[#c4714a]"
            />
          </OptionField>

          <OptionField>
            <OptionLabel>Max trip length</OptionLabel>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px]" style={{ color: "#1a1714" }}>
                {tripLength === 0 ? "Any" : `Under ${tripLength}h`}
              </span>
            </div>
            <Slider
              min={0}
              max={64}
              step={1}
              value={[tripLength]}
              onValueChange={(vals) => setTripLength(vals[0] ?? 1)}
              className="[&_[role=slider]]:bg-[#c4714a] [&_[role=slider]]:border-[#c4714a] [&_.range]:bg-[#c4714a]"
            />
          </OptionField>

          <div className="grid grid-cols-2 gap-3">
            <OptionField>
              <OptionLabel>Departure window</OptionLabel>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px]" style={{ color: "#1a1714" }}>
                  {departureWindow === 0 ? "Exact" : `±${departureWindow} day${departureWindow > 1 ? "s" : ""}`}
                </span>
              </div>
              <Slider
                min={0}
                max={3}
                step={1}
                value={[departureWindow]}
                onValueChange={(vals) => setDepartureWindow(vals[0] ?? 0)}
                className="[&_[role=slider]]:bg-[#c4714a] [&_[role=slider]]:border-[#c4714a] [&_.range]:bg-[#c4714a]"
              />
            </OptionField>

            <OptionField>
              <OptionLabel>Return window</OptionLabel>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px]" style={{ color: "#1a1714" }}>
                  {returnWindow === 0 ? "Exact" : `±${returnWindow} day${returnWindow > 1 ? "s" : ""}`}
                </span>
              </div>
              <Slider
                min={0}
                max={3}
                step={1}
                value={[returnWindow]}
                onValueChange={(vals) => setReturnWindow(vals[0] ?? 0)}
                className="[&_[role=slider]]:bg-[#c4714a] [&_[role=slider]]:border-[#c4714a] [&_.range]:bg-[#c4714a]"
              />
            </OptionField>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={nonstopOnly}
                onCheckedChange={(checked) => setNonstopOnly(!!checked)}
                className="border-[#b8b3ad] data-[state=checked]:bg-[#c4714a] data-[state=checked]:border-[#c4714a]"
              />
              <span className="text-[13px] font-medium" style={{ color: "#1a1714" }}>
                Nonstop only
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIncludedAirline([]);
                  setExcludedAirline([]);
                  setNonstopOnly(false);
                  setMinPrice(DEFAULT_MIN_PRICE);
                  setMaxPrice(DEFAULT_MAX_PRICE);
                  setTripLength(0);
                  setDepartureWindow(0);
                  setReturnWindow(0);
                }}
                className="text-[12px] font-medium px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(26,23,20,0.12)",
                  color: "#6b6560",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c4714a")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(26,23,20,0.12)")}
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => setAdvancedOpen(false)}
                className="text-[12px] font-medium px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                style={{
                  background: "#1a1714",
                  color: "#fdfcf9",
                }}
              >
                Done
              </button>
            </div>
          </div>

        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}