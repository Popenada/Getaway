import React from "react";
import {TextInput, View} from "react-native";
// Props allowing for airline parameter and price
type SearchBarProps = {
    departureDate: string;
    setDepartureDate: (t: string) => void;

    returnDate: string;
    setReturnDate: (t: string) => void;

    location: string;
    setLocation: (t: string) => void;

    
};
export default function SearchComponent({departureDate, setDepartureDate, returnDate, setReturnDate, location, setLocation}: SearchBarProps) {
  return (
    <View className="gap-3">
        <View className="gap-5">
            <TextInput
                className="border border-gray-300 rounded-xl p-8 text-base"
                onChangeText={setLocation}
                value={location}
                placeholder="Enter a location"
            />
        </View>

        <View className="gap-5">
            <TextInput
                className="border border-gray-300 rounded-xl p-8 text-base"
                onChangeText={setDepartureDate}
                value={departureDate}
                placeholder="Enter a departure date"
            />
    
            <TextInput
                className="border border-gray-300 rounded-xl p-8 text-base"
                onChangeText={setReturnDate}
                value={returnDate}
                placeholder="Enter a return date"
                keyboardType="numeric"
            />
            </View>
        </View>
    
  );
}
