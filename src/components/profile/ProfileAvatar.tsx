"use client";

import { useProfileQuery } from "@/hooks/react-query/profiles";
import { Loader } from "../Loader";
import { capitalizeFirstLetter } from "@/lib/utils";



export function ProfileAvatar() {
  const {data, isLoading, isError, error} = useProfileQuery();

   if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <>
      {data?.profile && (
        <div className={"flex justify-between items-start gap-4  w-[300px]"}>
          <h3 className="text-2xl  cursor-pointer">
            {capitalizeFirstLetter(data?.user.name)}
          </h3>
        </div>
      )}
    </>
  );
}
