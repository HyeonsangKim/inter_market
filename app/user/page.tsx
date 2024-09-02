import getCurrentUser from "@/lib/getCurrentUser";
import { checkAddress } from "@/lib/location";
export default async function Page() {
  const addressExit = await checkAddress();
  const userData = await getCurrentUser();

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      {/* <Address address={addressExit} userId={userData!.id} /> */}
      <h1>주소</h1>

      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>Hola!</h1>
        <h2 className='text-xl'>Welcome.</h2>
      </div>
    </div>
  );
}
