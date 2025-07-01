"use client";

import { Button } from "@/components/ui/button";
import { UserCardModal } from "@/components/UserCardModal";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import {
  DrinkingEnum,
  SmokingEnum,
  ZodiacEnum,
} from "@/lib/routes/profiles/enums";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Loader } from "../Loader";

const getSmokingLabel = (value?: SmokingEnum): string => {
  switch (value) {
    case SmokingEnum.NEVER:
      return "Non fumeur";
    case SmokingEnum.OCCASIONALLY:
      return "Occasionnellement";
    case SmokingEnum.REGULARLY:
      return "Régulièrement";
    case SmokingEnum.TRYING_TO_QUIT:
      return "Essaie d'arrêter";
    default:
      return "";
  }
};

const getDrinkingLabel = (value?: DrinkingEnum): string => {
  switch (value) {
    case DrinkingEnum.NEVER:
      return "Non buveur";
    case DrinkingEnum.SOCIALLY:
      return "Socialement";
    case DrinkingEnum.REGULARLY:
      return "Régulièrement";
    default:
      return "";
  }
};

const getZodiacLabel = (value?: ZodiacEnum): string => {
  switch (value) {
    case ZodiacEnum.ARIES:
      return "Bélier";
    case ZodiacEnum.TAURUS:
      return "Taureau";
    case ZodiacEnum.GEMINI:
      return "Gémeaux";
    case ZodiacEnum.CANCER:
      return "Cancer";
    case ZodiacEnum.LEO:
      return "Lion";
    case ZodiacEnum.VIRGO:
      return "Vierge";
    case ZodiacEnum.LIBRA:
      return "Balance";
    case ZodiacEnum.SCORPIO:
      return "Scorpion";
    case ZodiacEnum.SAGITTARIUS:
      return "Sagittaire";
    case ZodiacEnum.CAPRICORN:
      return "Capricorne";
    case ZodiacEnum.AQUARIUS:
      return "Verseau";
    case ZodiacEnum.PISCES:
      return "Poissons";
    case ZodiacEnum.DONT_BELIEVE:
      return "N'y croit pas";
    default:
      return "";
  }
};

// Fonction pour capitaliser la première lettre du prénom
const capitalizeFirstLetter = (name: string): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export function ProfileHeader() {
  const [isUserCardModalOpen, setUserCardModalOpen] = useState(false);
  const query = useProfileQuery();

  const handleOpenUserCardModal = () => setUserCardModalOpen(true);
  const handleCloseUserCardModal = () => setUserCardModalOpen(false);

  if (query.isLoading) {
    return <Loader />;
  }

  if (query.isError) {
    return <div>{JSON.stringify(query.error)}</div>;
  }

  return (
    <div className="flex justify-between items-center px-5 py-8 w-full md:max-w-[750px] md:mx-auto">
      <Settings />

      {query.data?.profile && (
        <Button
          onClick={handleOpenUserCardModal}
          className="ml-2"
          variant="outline"
          size="sm"
        >
          Voir profil
        </Button>
      )}

      {query.data?.user && query.data?.profile && (
        <UserCardModal
          isOpen={isUserCardModalOpen}
          onClose={handleCloseUserCardModal}
          name={query.data.user.name}
          age={query.data.user.age}
          location={
            typeof query.data.user.location === "string"
              ? query.data.user.location
              : query.data.profile.city || "Paris"
          }
          description={
            query.data.profile.interests
              ?.map((interest) => interest.description)
              .join(", ") || "Découvrez mes centres d'intérêt !"
          }
          images={
            query.data.profile.images || [
              "/vintage.png",
              "/vintage.png",
              "/vintage.png",
            ]
          }
          image_url={
            (query.data.profile.images &&
              query.data.profile.images.length > 0 &&
              query.data.profile.images[0]) ||
            "/vintage.png"
          }
          interests={query.data.profile.interests?.map(
            (interest) => interest.description,
          )}
          languages={query.data.profile.languages}
          zodiac={getZodiacLabel(query.data.profile.zodiac)}
          smoking={getSmokingLabel(query.data.profile.smoking)}
          drinking={getDrinkingLabel(query.data.profile.drinking)}
        />
      )}
    </div>
  );
}
