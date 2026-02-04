"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResultsPage() {
    return (
        <main className="p-50">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Results Page
            </h1>

        <Link href="/">
          <Button className="h-10 px-6 mt-4">
            Back to Home (testing)
          </Button>
        </Link>
        </main>
    );
}