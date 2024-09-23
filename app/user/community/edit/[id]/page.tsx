import EditForm from "@/components/post-edit-form";
import { getPost } from "./action";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const post = await getPost(Number(id));
  return <EditForm postId={id} post={post} />;
}
