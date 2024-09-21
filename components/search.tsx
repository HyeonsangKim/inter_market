"use client";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";

export const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="relative mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </form>
  );
};
export const RegionFilter: React.FC<{
  regions: { city: string; districts: string[] }[];
  onFilterChange: (city: string, district: string) => void;
}> = ({ regions, onFilterChange }) => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("");
    onFilterChange(city, "");
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    onFilterChange(selectedCity, district);
  };

  return (
    <div className="flex space-x-4 mb-6">
      <div className="relative">
        <select
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All cities</option>
          {regions.map((region) => (
            <option key={region.city} value={region.city}>
              {region.city}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      {selectedCity && (
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All districts</option>
            {regions
              .find((region) => region.city === selectedCity)
              ?.districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      )}
    </div>
  );
};
