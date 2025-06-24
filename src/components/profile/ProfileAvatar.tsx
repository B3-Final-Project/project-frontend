'use client'
import { UserCardModal } from "@/components/UserCardModal";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import { DrinkingEnum, SmokingEnum, ZodiacEnum } from "@/lib/routes/profiles/enums"; // Assuming enums are barrel exported from here
import Image from 'next/image';
import { useState } from 'react';
import { FullScreenLoading } from "../FullScreenLoading";

const getSmokingLabel = (value?: SmokingEnum): string => {
  switch (value) {
    case SmokingEnum.NEVER: return 'Non fumeur';
    case SmokingEnum.OCCASIONALLY: return 'Occasionnellement';
    case SmokingEnum.REGULARLY: return 'Régulièrement';
    case SmokingEnum.TRYING_TO_QUIT: return 'Essaie d\'arrêter';
    default: return '';
  }
};

const getDrinkingLabel = (value?: DrinkingEnum): string => {
  switch (value) {
    case DrinkingEnum.NEVER: return 'Non buveur';
    case DrinkingEnum.SOCIALLY: return 'Socialement';
    case DrinkingEnum.REGULARLY: return 'Régulièrement';
    default: return '';
  }
};

const getZodiacLabel = (value?: ZodiacEnum): string => {
  switch (value) {
    case ZodiacEnum.ARIES: return 'Bélier';
    case ZodiacEnum.TAURUS: return 'Taureau';
    case ZodiacEnum.GEMINI: return 'Gémeaux';
    case ZodiacEnum.CANCER: return 'Cancer';
    case ZodiacEnum.LEO: return 'Lion';
    case ZodiacEnum.VIRGO: return 'Vierge';
    case ZodiacEnum.LIBRA: return 'Balance';
    case ZodiacEnum.SCORPIO: return 'Scorpion';
    case ZodiacEnum.SAGITTARIUS: return 'Sagittaire';
    case ZodiacEnum.CAPRICORN: return 'Capricorne';
    case ZodiacEnum.AQUARIUS: return 'Verseau';
    case ZodiacEnum.PISCES: return 'Poissons';
    case ZodiacEnum.DONT_BELIEVE: return 'N\'y croit pas';
    default: return '';
  }
};

export function ProfileAvatar() {
  const [isUserCardModalOpen, setUserCardModalOpen] = useState(false);

  const query = useProfileQuery();

  const handleOpenUserCardModal = () => setUserCardModalOpen(true);
  const handleCloseUserCardModal = () => setUserCardModalOpen(false);

  if (query.isLoading) {
    return <FullScreenLoading />
  }

  if (query.isError) {
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

      {query.data?.profile && (
        <div className={'flex justify-between items-center gap-4'}>
          <h3 className="text-2xl font-bold cursor-pointer" onClick={handleOpenUserCardModal}>{query.data?.user.name}</h3>
        </div>
      )}
      {query.data?.user && query.data?.profile && (
        <UserCardModal
          isOpen={isUserCardModalOpen}
          onClose={handleCloseUserCardModal}
          name={query.data.user.name}
          age={query.data.user.age}
          location={query.data.user.location}
          description={query.data.profile.interests?.map(interest => interest.description).join(', ') || "Découvrez mes centres d'intérêt !"}
          image_url={(query.data.profile.images && query.data.profile.images.length > 0 && query.data.profile.images[0]) || '/vintage.png'}
          interests={query.data.profile.interests?.map(interest => interest.description)}
          languages={query.data.profile.languages}
          zodiac={getZodiacLabel(query.data.profile.zodiac)}
          smoking={getSmokingLabel(query.data.profile.smoking)}
          drinking={getDrinkingLabel(query.data.profile.drinking)}
        />
      )}
    </>
  );
}
