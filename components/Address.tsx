"use client";
import { fetchAddress, insertAddress } from "@/lib/location";
import { MapPin, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { regions } from "@/app/utils/address-info";
import { AddressProps } from "@/app/types/props";

interface Address {
  province?: string | null;
  city?: string | null;
  district?: string | null;
  fullAddress?: string | null;
}

interface LocationProps {
  latitude: number;
  longitude: number;
}

export default function AddressInfo({ address, userId }: AddressProps) {
  const router = useRouter();
  const [location, setLocation] = useState<LocationProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Address | null>(address);

  const getDisplayAddress = (address: Address | null) => {
    if (!address?.province) return "";

    const regionData = regions.find((r) => r.province === address.province);
    if (!regionData) return "";

    if (regionData.type === "metropolitan") {
      return `${address.province} ${address.district || ""}`;
    }

    if (address.city) {
      const cityData = (
        regionData.districts as { city: string; areas: string[] }[]
      ).find((d) => d.city === address.city);
      if (cityData?.areas?.length) {
        return `${address.province} ${address.city} ${address.district || ""}`;
      }
      return `${address.province} ${address.city}`;
    }

    return address.province;
  };

  const handleFetchAddress = () => {
    if (!userId) {
      router.push(
        "/login?redirectTo=" + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const fetchedAddress = await fetchAddress(latitude, longitude);

          if (fetchedAddress) {
            setNewAddress(fetchedAddress);
            insertAddress({ fetchedAddress, userId });
          } else {
            console.error("Fetched address is null");
          }
        } catch (err) {
          if (err instanceof Error && err.message === "FOREIGN_ADDRESS") {
            setError("Sorry, this service is only available in South Korea");
            return;
          }
          setError("Unable to retrieve address");
        }
      },
      () => {
        setError("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0">
          <MapPin size={20} className="text-indigo-500 mr-2 flex-shrink-0" />
          {newAddress ? (
            <p className="text-sm text-gray-700 truncate">
              {getDisplayAddress(newAddress)}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Address not set</p>
          )}
        </div>
        <button
          onClick={handleFetchAddress}
          className="flex items-center text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-200 transition-colors duration-200 ml-4 flex-shrink-0 whitespace-nowrap"
        >
          <RefreshCw size={14} className="mr-1.5" />
          {userId ? "Update Location" : "Sign in to Update"}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
