"use client";

import { Badge } from "@/components/ui/badge"

export type GroupOption = {
  label: string;
  value: string
  classname: string;
};

interface GroupControlProps {
  options: GroupOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function GroupControl({ options, value, onChange }: GroupControlProps) {
  return (
    <div className="flex gap-3">
      <span className="text-sm font-small text-gray-800">
        Group by:
      </span>
      <div className="flex flex-row gap-2">
        {options.map((item) => {
          const isActive = value === item.value;
          return (
            <Badge
              key={item.value}
              variant={isActive ? "default" : "outline"}
              onClick={() => onChange(item.value)}
              className={`
                cursor-pointer px-2 py-0 rounded-full transition-all duration-300
                ${isActive ? "scale-105 shadow-sm" : "opacity-60 hover:opacity-100"}
                ${item.classname}
              `}
              style={isActive ? { backgroundColor: "#c4714a", color: "white", border: "none" } : {}}
            >
              {item.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}