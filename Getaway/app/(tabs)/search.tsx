import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// Import SearchBar component into the Search screen
import SearchBar from "@/components/SearchBar"
export default function SearchScreen() {
  const [departureDate, setDepartureDate] = React.useState("");
  const [returnDate, setReturnDate] = React.useState("");
  const [location, setLocation] = React.useState("");
  return (
    <SafeAreaView className="flex-1 p-5">
     <SearchBar
        location={location}
        setLocation={setLocation}
        
        returnDate={returnDate}
        setReturnDate={setReturnDate}

        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
     />
    </SafeAreaView>
  );
}
