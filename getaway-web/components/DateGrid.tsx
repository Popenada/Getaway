"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PriceByDate = {
  date: string;
  price: number;
};

type DateGridProps = {
  prices: PriceByDate[];
  selectedDate?: string | null;
  onSelectDate?: (date: string) => void;
};

export default function DateGrid({ prices, selectedDate, onSelectDate }: DateGridProps) {
  const cheapestPrice = Math.min(...prices.map((p) => p.price));

  return (
    <div className="flex flex-col gap-4">
      {prices.map((item) => {
        const isCheapest = item.price === cheapestPrice;
        const isSelected = item.date === selectedDate;

        return (
          <Card
            key={item.date}
            onClick={() => onSelectDate?.(item.date)}
            className={`cursor-pointer transition hover:shadow-md ${
              isCheapest ? "border-green-500" : ""
            } ${isSelected ? "bg-blue-100 border-blue-500" : ""}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {new Date(item.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "numeric",
                    day: "numeric"
                })}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Airline</span>
              <Badge
                variant={isCheapest ? "default" : "secondary"}
                className="text-base px-3 py-1"
              >
                ${item.price}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
