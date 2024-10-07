"use client";
import { fetchAddress, insertAddress } from "@/lib/location";
import { MapPin, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
interface LocationProps {
  latitude: number;
  longitude: number;
}

interface AddressProps {
  address: {
    si?: string | null;
    gu?: string | null;
    dong?: string | null;
    fullAdress?: string | null;
  } | null;
  userId: string;
}

interface Address {
  si?: string | null;
  gu?: string | null;
  dong?: string | null;
  fullAdress?: string | null;
}

export default function AddressInfo({ address, userId }: AddressProps) {
  const [location, setLocation] = useState<LocationProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Address | null>(address);

  useEffect(() => {
    if (!address || address.si === null) {
      setNewAddress(null);
    } else {
      setNewAddress(address);
    }
  }, [address]);

  const handleFetchAddress = () => {
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
            // null에 대한 추가 처리 로직
          }
        } catch (err) {
          setError("Unable to retrieve address");
        }
      },
      () => {
        setError("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin size={20} className="text-indigo-500 mr-2" />
          {newAddress ? (
            <p className="text-sm text-gray-700">
              {newAddress.si} {newAddress.gu}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Address not set</p>
          )}
        </div>
        <button
          onClick={handleFetchAddress}
          className="flex items-center text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors duration-200 ml-4"
        >
          <RefreshCw size={14} className="mr-1" />
          Update Location
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
