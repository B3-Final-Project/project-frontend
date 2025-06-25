'use client'
import { useProfileQuery } from "@/hooks/react-query/profiles";
import { Loader } from "../Loader";


// Fonction pour capitaliser la première lettre du prénom
const capitalizeFirstLetter = (name: string): string => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export function ProfileAvatar() {

  const query = useProfileQuery();


  if (query.isLoading) {
    return <Loader />
  }

  if (query.isError) {
    return <div>{JSON.stringify(query.error)}</div>
  }

  return (
    <>

      {query.data?.profile && (
        <div className={'flex justify-between items-start gap-4  w-[300px]'}>
          <h3 className="text-2xl  cursor-pointer">
            {capitalizeFirstLetter(query.data?.user.name)}
          </h3>
        </div>
      )}
    </>
  );
}
