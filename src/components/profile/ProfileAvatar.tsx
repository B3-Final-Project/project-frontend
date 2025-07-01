"use client";

import { useEffect, useState } from "react";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import { mapUserProfileToProfileCardType } from "@/lib/utils/card-utils";
import { ProfileCardType } from "@/lib/routes/profiles/dto/profile-card-type.dto";
import { Loader } from "../Loader";

// Fonction pour capitaliser la première lettre du prénom
const capitalizeFirstLetter = (name: string): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export function ProfileAvatar() {
  const [isUserCardModalOpen, setIsUserCardModalOpen] = useState(false);
  const [userCard, setUserCard] = useState<ProfileCardType>();
  const query = useProfileQuery();

  useEffect(() => {
    if (query.data) {
      setUserCard(mapUserProfileToProfileCardType(query.data));
    }
  }, [query.data]);

  const handleOpenUserCardModal = () => setIsUserCardModalOpen(true);
  const handleCloseUserCardModal = () => setIsUserCardModalOpen(false);

  if (query.isLoading) {
    return <Loader />;
  }

  if (query.isError) {
    return <div>{JSON.stringify(query.error)}</div>;
  }

  return (
    <>
      {query.data?.profile && (
        <div className={"flex justify-between items-start gap-4  w-[300px]"}>
          <h3 className="text-2xl  cursor-pointer">
            {capitalizeFirstLetter(query.data?.user.name)}
          </h3>
        </div>
      )}
    </>
  );
}
