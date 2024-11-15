"use client";
import { regions } from "@/app/utils/address-info";
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

interface RegionFilterProps {
  onFilterChange: (province: string, city: string, district: string) => void;
  initialProvince?: string;
  initialCity?: string;
  initialDistrict?: string;
}

export const RegionFilter: React.FC<RegionFilterProps> = ({
  onFilterChange,
  initialProvince = "",
  initialCity = "",
  initialDistrict = "",
}) => {
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);

  const currentRegion = regions.find((r) => r.province === selectedProvince);

  const cities =
    currentRegion?.type === "province"
      ? (currentRegion.districts as { city: string; areas: string[] }[]).map(
          (d) => d.city
        )
      : [];

  const districts =
    currentRegion?.type === "metropolitan"
      ? (currentRegion.districts as string[])
      : currentRegion?.type === "province"
      ? (currentRegion.districts as { city: string; areas: string[] }[]).find(
          (d) => d.city === selectedCity
        )?.areas || []
      : [];

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedCity("");
    setSelectedDistrict("");
    onFilterChange(province, "", "");
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("");
    onFilterChange(selectedProvince, city || "", "");
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    onFilterChange(selectedProvince, selectedCity || "", district || "");
  };

  return (
    <div className="flex space-x-4 mb-6">
      {/* Province Select */}
      <div className="relative">
        <select
          value={selectedProvince}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Provinces</option>
          {regions.map((region) => (
            <option key={region.province} value={region.province}>
              {region.province}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {/* City Select (for provinces only) */}
      {selectedProvince && currentRegion?.type === "province" && (
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      )}

      {selectedProvince && districts.length > 0 && (
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Districts</option>
            {districts.map((district) => (
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
