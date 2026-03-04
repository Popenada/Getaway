"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h1>

        <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm p-4">
          
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What makes Getaway different from other flight search websites?
            </AccordionTrigger>
            <AccordionContent>
              Getaway was made for the unsure, but flexible traveler looking for the 
              lowest price point possible. If you don't have a specific date to leave 
              or return home, but are just looking for the best combination of departure 
              and arrival dates to give you the best prices, then Getaway is for you. 
              Unlike our competitors, Getaway allows you to select a range of departure 
              and arrival dates, as well as a range of departure and arrival airports,
              making planning your trip cheaper than ever before.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              How do I search for flights on Getaway?
            </AccordionTrigger>
            <AccordionContent>
              To start your search, click the search bar to fill in a blank flight 
              search, or click the "Getaway" button to get a pre-filled trip. For a
              blank flight search, fill out your departure airport(s) and arrival
              airport(s) in their respective boxes. Then, fill out the departure and
              arrival dates in the calendar below, and input the number of travelers.
              For more advanced options, you can click the "Advanced options" button
              to search for preferred airlines, price ranges, and more.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              How does the flexible date search work?
            </AccordionTrigger>
            <AccordionContent>
              We search across a range of departure and return dates to help you
              find the lowest available prices within your flexible window.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              How does the flexible origin and destination search work?
            </AccordionTrigger>
            <AccordionContent>
              We understand that you may have multiple airports that are accessible
              to you, so to get the best possible price, Getaway gives you the option
              to input more than one departure airport, as well as more than one arrival
              airport, so you can find the best route for your trip.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              How can I keep track of and book my trips?
            </AccordionTrigger>
            <AccordionContent>
              As of now, Getaway does not allow for you to save your trips, but you do 
              always have access to your recent searches. If you find a trip plan that you 
              like, make sure to save the information somewhere! We also have a Google 
              Flights link attached to each trip plan, so you can match the information 
              and book your flight from there.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>
              What is the "Getaway" button?
            </AccordionTrigger>
            <AccordionContent>
              The "Getaway" button is a special feature that pre-fills a random,
              low-price trip for the ultimate flexible and adventurous traveler.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </main>
  );
}