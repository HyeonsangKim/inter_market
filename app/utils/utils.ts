import { regions } from "./address-info";

export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");

  return formatter.format(diff, "days");
}

export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}
export const getDisplayAddress = (product: any) => {
  if (!product?.user?.province) {
    return "Unknown location"; // 기본값 처리
  }

  const regionData = regions.find((r) => r.province === product.user.province);
  if (!regionData) {
    return product.user.province; // `regions`에 데이터가 없으면 `province`만 반환
  }

  if (regionData.type === "metropolitan") {
    return `${product.user.province} ${product.user.district || ""}`.trim();
  }

  return `${product.user.province} ${product.user.city || ""} ${
    product.user.district || ""
  }`.trim();
};
