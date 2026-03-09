"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <main className="getaway-bg p-6 min-h-screen">
      <div className="relative z-10 flex flex-col min-h-screen items-center px-10 pt-12 pb-16">
    
        <h1
        className="text-center leading-[0.92] mb-6 animate-fade-up-2"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(40px, 6vw, 64px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "#1a1714",
        }}
        >
          Frequently Asked
          <br />
          <em style={{ color: "#c4714a" }}>Questions</em>
        </h1>

        <div
        className="w-full max-w-3xl rounded-3xl p-7 animate-fade-up-4"
        style={{
            background: "rgba(253,252,249,0.75)",
            border: "1px solid rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 40px rgba(26,23,20,0.10)",
        }}
        >

        <Accordion type="multiple" className="bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-4 animate-fade-up-1">
          
          <AccordionItem value="item-1">
            <AccordionTrigger
              className="text-[20px] leading-snug hover:text-[#c4714a] transition-colors"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
              }}
            >
              What makes Getaway different from other flight search websites?
            </AccordionTrigger>
            <AccordionContent
              className="text-[16px] leading-relaxed pt-2"
              style={{ color: "#6b6560" }}
            >
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
            <AccordionTrigger
              className="text-[20px] leading-snug hover:text-[#c4714a] transition-colors"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
              }}
            >
              How do I search for flights on Getaway?
            </AccordionTrigger>
            <AccordionContent
              className="text-[16px] leading-relaxed pt-2"
              style={{ color: "#6b6560" }}
            >
              To start your search, click the search bar to fill in a <strong>blank 
              flight search</strong>, or click the "Getaway" button to get a
              <strong> pre-filled trip</strong>. For a blank flight search, fill out 
              your departure airport(s) and arrival airport(s) in their respective 
              boxes. Then, fill out the departure and arrival dates in the calendar 
              below, and input the number of travelers. <br /><br />
              
              For more advanced options, you can click the "Advanced options" button
              to search for preferred airlines, price ranges, and more.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger
              className="text-[20px] leading-snug hover:text-[#c4714a] transition-colors"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
              }}
            >
              How does the flexible date search work?
            </AccordionTrigger>
            <AccordionContent
              className="text-[16px] leading-relaxed pt-2"
              style={{ color: "#6b6560" }}
            >
              We search across a range of departure and return dates to help you
              find the lowest available prices within your flexible window.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger
              className="text-[20px] leading-snug hover:text-[#c4714a] transition-colors"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
              }}
            >
              How does the flexible origin and destination search work?
            </AccordionTrigger>
            <AccordionContent
              className="text-[16px] leading-relaxed pt-2"
              style={{ color: "#6b6560" }}
            >
              We understand that you may have multiple airports that are accessible
              to you, so to get the best possible price, Getaway gives you the option
              to input more than one departure airport, as well as more than one 
              arrival airport, so you can find the best route for your trip.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger
              className="text-[20px] leading-snug hover:text-[#c4714a] transition-colors"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
              }}
            >
              How can I keep track of and book my trips?
            </AccordionTrigger>
            <AccordionContent
              className="text-[16px] leading-relaxed pt-2"
              style={{ color: "#6b6560" }}
            >
              As of now, Getaway does not allow for you to save your trips, but you do 
              always have access to your recent searches. If you find a trip plan that 
              you like, make sure to save the information somewhere! If you find a trip 
              you like, you can use the Google Flights link attached to each result
              to view the same itinerary and complete your booking there.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger
              className="text-[20px] leading-snug hover:text-[#c4714a] transition-colors"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
              }}
            >
              What is the "Getaway" button?
            </AccordionTrigger>
            <AccordionContent
              className="text-[16px] leading-relaxed pt-2"
              style={{ color: "#6b6560" }}
            >
              The "Getaway" button is a special feature for the ultimate flexible and 
              adventurous traveler that generates a randomly selected trip with 
              flexible dates and airports to help you quickly discover potential 
              low-price travel opportunities. 
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger
              className="text-[20px] leading-snug hover:text-[#c4714a] transition-colors"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
              }}
            >
              Who is behind the Getaway team?
            </AccordionTrigger>
            <AccordionContent
              className="text-[16px] leading-relaxed pt-2"
              style={{ color: "#6b6560" }}
            >
              Getaway was created when Sayer Harry noticed how inconvenient it was
              to try to find the best prices when searching for flights, especially
              since he usually had a flexible schedule that would allow him to tweak
              his departure and arrival dates to whatever would have the cheapest 
              flight. Our team, made up of Sayer Harry, Jarod Cardenas, Alfred Nguyen, 
              Tarun Yendrapati, and Yong Zhao, resonated with these traveling quirks
              as well, and thus Getaway was born.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
        </div>
      </div>
    </main>
  );
}