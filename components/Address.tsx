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
    <div className='flex flex-row gap-10 py-4 px-6'>
      {newAddress?.dong === null ? (
        <div>Loading...</div>
      ) : (
        <>
          {newAddress ? (
            <div className='flex text-xs'>
              <p>
                Address:&nbsp;{newAddress.si}&nbsp;
                {newAddress.gu}
              </p>
            </div>
          ) : (
            <div>Error : {error && <p>{error}</p>}</div>
          )}
        </>
      )}
      <button onClick={handleFetchAddress} className='btn-primary text-xs'>
        Get new Address
      </button>
    </div>
  );
}
