"use client";

import Fuse from "fuse.js";
import airlinesData from "@/lib/airlines";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { set } from "date-fns";

const DEBOUNCE_DELAY = 50;

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 2000;

type AdvancedOptionsComponentProps = {
  advancedOpen: boolean;
  setAdvancedOpen: (v: boolean) => void;
  includedAirlines: Array<{ label: string; code: string; logo: string }>;
  setIncludedAirlines: (a: Array<{ label: string; code: string; logo: string }>) => void;
  excludedAirlines: Array<{ label: string; code: string; logo: string }>;
  setExcludedAirlines: (a: Array<{ label: string; code: string; logo: string }>) => void;
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

const fuse = new Fuse(airlinesData, {
  keys: ["name", "id"],
  threshold: 0.3, // lower threshold for stricter matching
});

function searchAirlines(query: string) {
  if (query.length < 2) return [];
  const results = fuse.search(query).map(result => ({
    label: `${result.item.name} (${result.item.id})`,
    code: result.item.id,
    name: result.item.name,
    logo: result.item.logo,
    type: "AIRLINE",
  }));
  return results;
}

export default function AdvancedOptionsComponent({
  advancedOpen,
  setAdvancedOpen,
  includedAirlines,
  setIncludedAirlines,
  excludedAirlines,
  setExcludedAirlines,
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
  const [includedAirlineInput, setIncludedAirlineInput] = useState("");
  const [excludedAirlineInput, setExcludedAirlineInput] = useState("");
  const [includedAirlineSuggestions, setIncludedAirlineSuggestions] = useState<{ label: string; code: string; logo: string }[]>([]);
  const [excludedAirlineSuggestions, setExcludedAirlineSuggestions] = useState<{ label: string; code: string; logo: string }[]>([]);
  const includedAirlineTimeout = useRef<NodeJS.Timeout | null>(null);
  const excludedAirlineTimeout = useRef<NodeJS.Timeout | null>(null);

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
            {/* Included Airlines */}
            <div className="relative">
              <OptionField>
                <OptionLabel>Included airlines</OptionLabel>
                <div className="flex flex-wrap gap-1 items-center">
                  {includedAirlines.map((airline, index) => (
                    <span
                      key={`${airline.code}-${index}`}
                      className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      style={{ background: "#e8e0d4", color: "#1a1714" }}
                    >
                      {airline.logo && (
                        <img 
                          src={airline.logo}
                          alt={airline.code}
                          className="w-4 h-4 object-contain"
                          onError={(e) => e.currentTarget.style.display = "none"}
                        />
                      )}
                      <span className="font-medium">{airline.code}</span>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setIncludedAirlines(includedAirlines.filter((_, i) => i !== index));
                        }}
                        className="ml-1 font-bold opacity-60 hover:opacity-100"
                        aria-label="Remove airline"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <Input
                    value={includedAirlineInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setIncludedAirlineInput(value);
                      if (includedAirlineTimeout.current) clearTimeout(includedAirlineTimeout.current);
                      if (value.length < 2) {
                        setIncludedAirlineSuggestions([]);
                        return;
                      }
                      includedAirlineTimeout.current = setTimeout(() => {
                        setIncludedAirlineSuggestions(searchAirlines(value));
                      }, DEBOUNCE_DELAY);
                    }}
                    placeholder={includedAirlines.length === 0 ? "UA, DL, AA" : "Add another..."}
                    onBlur={() => setTimeout(() => setIncludedAirlineSuggestions([]), 150)}
                    className="border-0 bg-transparent p-0 h-auto text-[14px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-[80px]"
                  />
                </div>
              </OptionField>

              {includedAirlineSuggestions.length > 0 && includedAirlineInput.length > 1 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-y-auto max-h-40 z-[120] py-1"
                  style={{
                    background: "#fdfcf9",
                    border: "1px solid rgba(26,23,20,0.08)",
                    boxShadow: "0 8px 32px rgba(26,23,20,0.12)",
                  }}
                >
                  {includedAirlineSuggestions.map((suggestion, index) => (
                    <div
                      key={`included-${index}-${suggestion.code}`}
                      className="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 hover:bg-[#f0ede8] flex items-center gap-2"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if (!includedAirlines.some(a => a.code === suggestion.code)) {
                          setIncludedAirlines([...includedAirlines, { label: suggestion.label, code: suggestion.code, logo: suggestion.logo }]);
                        }
                        setIncludedAirlineInput("");
                        setIncludedAirlineSuggestions([]);
                      }}
                    >
                      {suggestion.logo && (
                        <img 
                          src={suggestion.logo}
                          alt={suggestion.code}
                          className="w-4 h-4 object-contain inline-block mr-2"
                          onError={(e) => e.currentTarget.style.display = "none"}
                        />
                      )}
                      <span className="font-medium" style={{ color: '#1a1714' }}>{suggestion.code}</span>
                      <span className="ml-1" style={{ color: '#6b6560'}}>{suggestion.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Excluded Airlines */}
            <div className="relative">
              <OptionField>
                <OptionLabel>Excluded airlines</OptionLabel>
                <div className="flex flex-wrap gap-1 items-center">
                  {excludedAirlines.map((airline, index) => (
                    <span
                      key={`${airline.code}-${index}`}
                      className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      style={{ background: "#e8e0d4", color: "#1a1714" }}
                    >
                      {airline.logo && (
                        <img
                          src={airline.logo}
                          alt={airline.code}
                          className="w-4 h-4 object-contain"
                          onError={(e) => e.currentTarget.style.display = "none"}
                        />
                      )}
                      <span className="font-medium">{airline.code}</span>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setExcludedAirlines(excludedAirlines.filter((_, i) => i !== index));
                        }}
                        className="ml-1 font-bold opacity-60 hover:opacity-100"
                        aria-label="Remove airline"
                      >
                        x
                      </button>
                    </span>
                  ))}
                  <Input
                    value={excludedAirlineInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setExcludedAirlineInput(value);
                      if (excludedAirlineTimeout.current) clearTimeout(excludedAirlineTimeout.current);
                      if (value.length < 2) {
                        setExcludedAirlineSuggestions([]);
                        return;
                      }
                      excludedAirlineTimeout.current = setTimeout(() => {
                        setExcludedAirlineSuggestions(searchAirlines(value));
                      }, DEBOUNCE_DELAY);
                    }}
                    placeholder={excludedAirlines.length === 0 ? "WN, F9" : "Add another..."}
                    onBlur={() => setTimeout(() => setExcludedAirlineSuggestions([]), 150)}
                    className="border-0 bg-transparent p-0 h-auto text-[14px] text-[#1a1714] placeholder:text-[#b8b3ad] placeholder:font-light focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-[80px]"
                  />
                </div>
              </OptionField>

              {excludedAirlineSuggestions.length > 0 && excludedAirlineInput.length > 1 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-y-auto max-h-40 z-[120] py-1"
                  style={{
                    background: "#fdfcf9",
                    border: "1px solid rgba(26,23,20,0.08)",
                    boxShadow: "0 8px 32px rgba(26,23,20,0.12)",
                  }}
                >
                  {excludedAirlineSuggestions.map((suggestion, index) => (
                    <div
                      key={`excluded-${index}-${suggestion.code}`}
                      className="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 hover:bg-[#f0ede8] flex items-center gap-2"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if (!excludedAirlines.some(a => a.code === suggestion.code)) {
                          setExcludedAirlines([...excludedAirlines, { label: suggestion.label, code: suggestion.code, logo: suggestion.logo }]);
                        }
                        setExcludedAirlineInput("");
                        setExcludedAirlineSuggestions([]);
                      }}
                    >
                      {suggestion.logo && (
                        <img
                          src={suggestion.logo}
                          alt={suggestion.code}
                          className="w-5 h-5 object-contain"
                          onError={(e) => e.currentTarget.style.display = "none"}
                        />
                      )}
                      <span className="font-medium" style={{ color: '#1a1714' }}>{suggestion.code}</span>
                      <span className="ml-1" style={{ color: '#6b6560'}}>{suggestion.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                {tripLength === 0 ? "Any" : `Under ${tripLength} day${tripLength > 1 ? "s" : ""}`}
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
                  setIncludedAirlines([]);
                  setIncludedAirlineInput("");
                  setExcludedAirlines([]);
                  setExcludedAirlineInput("");
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