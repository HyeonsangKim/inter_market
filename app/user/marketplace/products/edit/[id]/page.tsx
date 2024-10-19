import EditForm from "@/components/product-component/editform";
import { getProduct } from "../../[id]/action";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const product = await getProduct(Number(id));
  return <EditForm productId={id} product={product} />;
}
