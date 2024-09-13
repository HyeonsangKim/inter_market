"use client";
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
    <form onSubmit={handleSearch} className='mb-4'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Enter search term'
        className='p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
      />
      <button
        type='submit'
        className='bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600'
      >
        Search
      </button>
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
    <div className='mb-4'>
      <select
        value={selectedCity}
        onChange={(e) => handleCityChange(e.target.value)}
        className='mr-2 p-2 border rounded-md text-black'
      >
        <option value=''>All Cities</option>
        {regions.map((region) => (
          <option key={region.city} value={region.city}>
            {region.city}
          </option>
        ))}
      </select>
      {selectedCity && (
        <select
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className='p-2 border rounded-md text-black'
        >
          <option value=''>All Districts</option>
          {regions
            .find((region) => region.city === selectedCity)
            ?.districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
        </select>
      )}
    </div>
  );
};
