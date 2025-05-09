'use client'
import { UserCardModal } from "@/components/profile/UserCardModal";
import Image from 'next/image'
import { useProfileQuery } from "@/hooks/react-query/profiles";

export function ProfileAvatar() {
  const query = useProfileQuery()

  if (query.isLoading){
    return <div>Loading...</div>
  }

  if (query.isError){
    return <div>{JSON.stringify(query.error)}</div>
  }

  return (
    <>
      <div className="w-[100px] h-[100px] border-4 border-background bg-red-500 rounded-full flex items-center justify-center -translate-y-1/2 overflow-hidden">
        <Image
          src="/vintage.png"
          alt="Profile"
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      {query.data?.profile &&
      <div className={'flex justify-between gap-40'}>
        <h3 className="text-2xl font-bold">{query.data?.user.name}</h3>
        <UserCardModal
          name={query.data?.user.name}
          age={query.data?.user.age}
          location={query.data?.user.location}
          // using the first interest as a placeholder
          description={query.data?.profile.interests?.map((interest) => interest.description).toString() ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna} aliqua."}
        />
      </div>}
    </>
  );
}
