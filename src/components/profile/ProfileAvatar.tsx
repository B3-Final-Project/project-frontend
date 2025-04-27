import { UserCardModal } from "@/components/profile/UserCardModal";
import Image from 'next/image'

interface ProfileAvatarProps {
  name: string;
  age?: number;
  location?: string;
  description?: string;
}

export function ProfileAvatar({
  name,
  age,
  location,
  description,
}: ProfileAvatarProps) {
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

      <div className={'flex justify-between gap-40'}>
        <h3 className="text-2xl font-bold">{name}</h3>
        <UserCardModal
          name={name}
          age={age}
          location={location}
          description={description}
        />
      </div>
    </>
  );
}
