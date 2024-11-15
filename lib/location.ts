"use server";

import { regions } from "@/app/utils/address-info";
import { db } from "./db";
import { getCurrentUser } from "@/app/utils/supabase/get-user";

interface Address {
  province?: string | null;
  city?: string | null;
  district?: string | null;
  fullAddress?: string | null;
}

export const checkAddress = async () => {
  const userData = await getCurrentUser();

  if (userData) {
    const user = await db.user.findUnique({
      where: {
        id: userData.id,
      },
      select: {
        province: true,
        city: true,
        district: true,
        fullAddress: true,
      },
    });

    if (!user) return null;

    if (!user.province && !user.city && !user.district) {
      return null;
    }

    return {
      province: user.province,
      city: user.city,
      district: user.district,
      fullAddress: user.fullAddress,
    };
  }

  return null;
};
export const insertAddress = async ({
  fetchedAddress,
  userId,
}: {
  fetchedAddress: Address;
  userId: string;
}) => {
  if (userId) {
    const result = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        province: fetchedAddress.province,
        city: fetchedAddress.city,
        district: fetchedAddress.district,
        fullAddress: fetchedAddress.fullAddress,
      },
    });
    return result;
  }
  return null;
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

    const country = addressComponents.find((comp: any) =>
      comp.types.includes("country")
    )?.short_name;

    if (country !== "KR") {
      throw new Error("FOREIGN_ADDRESS");
    }

    const rawProvince = addressComponents.find((comp: any) =>
      comp.types.includes("administrative_area_level_1")
    )?.long_name;

    const regionData = regions.find((r) => r.province === rawProvince);
    if (!regionData) {
      throw new Error("UNSUPPORTED_REGION");
    }

    let city: string | undefined;
    let district: string | undefined;

    if (regionData.type === "metropolitan") {
      district = addressComponents.find((comp: any) =>
        comp.types.includes("sublocality_level_1")
      )?.long_name;

      if (district && !(regionData.districts as string[]).includes(district)) {
        district = undefined;
      }
    } else {
      const rawCity = addressComponents.find((comp: any) =>
        comp.types.includes("locality")
      )?.long_name;

      const cityData = (
        regionData.districts as { city: string; areas: string[] }[]
      ).find((d) => d.city === rawCity);

      if (cityData) {
        city = cityData.city;
        if (cityData.areas.length > 0) {
          district = addressComponents.find((comp: any) =>
            comp.types.includes("sublocality_level_1")
          )?.long_name;

          if (district && !cityData.areas.includes(district)) {
            district = undefined;
          }
        }
      }
    }

    const fullAddress = [regionData.province, city, district]
      .filter(Boolean)
      .join(" ");

    return {
      province: regionData.province,
      city,
      district,
      fullAddress,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "FOREIGN_ADDRESS") {
        throw new Error("Service is only available in South Korea");
      }
      if (error.message === "UNSUPPORTED_REGION") {
        throw new Error("Unsupported region");
      }
    }
    console.error(error);
    return null;
  }
};
