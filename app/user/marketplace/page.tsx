import Link from "next/link";

export default async function Page() {
  return (
    <div className='p-4'>
      <div className='cursor-pointer'>
        <Link href='/user/marketplace/create'>new</Link>
      </div>
    </div>
  );
}
