import EditForm from "@/components/editForm";
import { getProduct } from "../../products/[id]/action";
import { useSearchParams } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const product = await getProduct(Number(id));
  return <EditForm productId={id} product={product} />;
}
