"use client";
import { checkAddress, fetchAddress, insertAddress } from "@/lib/location";
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

export default function Address({ address, userId }: AddressProps) {
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
          setNewAddress(fetchedAddress);
          insertAddress({ fetchedAddress, userId });
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
    <div className='flex flex-col gap-10 py-8 px-6'>
      {newAddress?.dong === null ? (
        <div>Loading</div>
      ) : (
        <>
          {newAddress ? (
            <div>
              <h3>Address Details:</h3>
              <p>Si: {newAddress.si}</p>
              <p>Gu: {newAddress.gu}</p>
              <p>Dong: {newAddress.dong}</p>
              <p>Full Address: {newAddress.fullAdress}</p>
            </div>
          ) : (
            <div>
              {error ? (
                <div>{error}</div>
              ) : (
                <button onClick={handleFetchAddress} className='btn-primary'>
                  Get Address
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
