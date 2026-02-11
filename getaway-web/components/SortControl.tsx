"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SortOption = {
  label: string;
  value: string;
};

interface SortControlProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function SortControl({ options, value, onChange }: SortControlProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-500">Sort by:</span>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Select sort" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={5}
          className="w-[180px]"
        >
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}