"use server";
import { db } from "./db";
import getCurrentUser from "./getCurrentUser";

interface Location {
  latitude: number;
  longitude: number;
}

interface Address {
  si?: string;
  gu?: string;
  dong?: string;
  fullAdress?: string;
}

interface LocationResult {
  location: Location | null;
  address: Address | null;
  error: string | null;
}

export const insertAddress = async ({
  fetchedAddress,
  userId,
}: {
  fetchedAddress: Address;
  userId: string;
}) => {
  console.log("-----");

  console.log(userId);
  console.log(fetchedAddress);

  if (userId) {
    const result = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        si: fetchedAddress.si,
        dong: fetchedAddress.dong,
        gu: fetchedAddress.gu,
        fullAdress: fetchedAddress.fullAdress,
      },
    });
    return result;
  } else {
    return null;
  }
};

export const checkAddress = async () => {
  const userData = await getCurrentUser();

  if (userData) {
    const user = await db.user.findUnique({
      where: {
        id: userData!.id,
      },
      select: {
        si: true,
        dong: true,
        gu: true,
        fullAdress: true,
      },
    });

    return user;
  } else {
    return null;
  }
};

export const fetchAddress = async (
  latitude: number,
  longitude: number
): Promise<Address | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch address: ${response.statusText}`);
    }

    const data = await response.json();
    const addressComponents = data.results[0]?.address_components || [];

    const si = addressComponents.find((comp: any) =>
      comp.types.includes("administrative_area_level_1")
    )?.long_name;
    const gu = addressComponents.find((comp: any) =>
      comp.types.includes("sublocality_level_1")
    )?.long_name;
    const dong = addressComponents.find((comp: any) =>
      comp.types.includes("sublocality_level_4")
    )?.long_name;
    const fullAdress = si + " " + " " + gu + " " + dong;
    return { si, gu, dong, fullAdress };
  } catch (error) {
    console.error(error);
    return null;
  }
};
