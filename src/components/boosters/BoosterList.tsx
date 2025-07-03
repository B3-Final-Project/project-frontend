import { Loader } from "@/components/Loader";
import { useGetAvailablePacksQuery } from "@/hooks/react-query/boosters";
import { BoosterPackDto } from "@/lib/routes/booster/dto/booster.dto";
import { RelationshipTypeEnum } from "@/lib/routes/profiles/enums";
import { formatRelationshipTypeEnum } from '@/lib/utils/enum-utils';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { GiGrass, GiMetalBar, GiPerspectiveDiceSixFacesRandom, GiRock, GiWaterDrop } from 'react-icons/gi';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const getBoosterIcon = (type: RelationshipTypeEnum, packName: string) => {
  if (packName.toLowerCase().includes('water')) {
    return <GiWaterDrop className="text-4xl text-blue-500" />;
  } else if (packName.toLowerCase().includes('grass')) {
    return <GiGrass className="text-4xl text-emerald-700" />;
  } else if (packName.toLowerCase().includes('rock')) {
    return <GiRock className="text-4xl text-amber-700" />;
  } else if (packName.toLowerCase().includes('metal')) {
    return <GiMetalBar className="text-4xl text-gray-400" />;
  } else if (packName.toLowerCase().includes('random')) {
    return <GiPerspectiveDiceSixFacesRandom className="text-4xl text-purple-500" />;
  }

  switch (type) {
    case RelationshipTypeEnum.CASUAL:
      return <GiWaterDrop className="text-4xl text-blue-500" />;
    case RelationshipTypeEnum.LONG_TERM:
      return <GiRock className="text-4xl text-amber-700" />;
    case RelationshipTypeEnum.MARRIAGE:
      return <GiMetalBar className="text-4xl text-gray-400" />;
    case RelationshipTypeEnum.FRIENDSHIP:
      return <GiGrass className="text-4xl text-emerald-700" />;
    case RelationshipTypeEnum.UNSURE:
      return <GiPerspectiveDiceSixFacesRandom className="text-4xl text-purple-500" />;
    case RelationshipTypeEnum.ANY:
      return <FaStar className="text-4xl text-amber-400" />;
    default:
      return <FaStar className="text-4xl text-amber-400" />;
  }
};

const getBoosterBackgroundColor = (type: RelationshipTypeEnum, packName: string): string => {
  if (packName.toLowerCase().includes('water')) {
    return 'bg-blue-500';
  } else if (packName.toLowerCase().includes('grass')) {
    return 'bg-emerald-700';
  } else if (packName.toLowerCase().includes('rock')) {
    return 'bg-amber-700';
  } else if (packName.toLowerCase().includes('metal')) {
    return 'bg-gray-600';
  } else if (packName.toLowerCase().includes('random')) {
    return 'bg-purple-500';
  }

  switch (type) {
    case RelationshipTypeEnum.CASUAL:
      return 'bg-blue-500';
    case RelationshipTypeEnum.LONG_TERM:
      return 'bg-amber-700';
    case RelationshipTypeEnum.MARRIAGE:
      return 'bg-gray-600';
    case RelationshipTypeEnum.FRIENDSHIP:
      return 'bg-emerald-700';
    case RelationshipTypeEnum.UNSURE:
      return 'bg-purple-500';
    case RelationshipTypeEnum.ANY:
      return 'bg-amber-400';
    default:
      return 'bg-primary';
  }
};

const shimmerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '250%',
  height: '100%',
  background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%, transparent 100%)',
  transform: 'translateX(-75%)',
  backgroundSize: '100% 100%',
  animation: 'shimmer 2.5s linear infinite',
  zIndex: 5,
  pointerEvents: 'none',
  overflow: 'hidden',
  borderRadius: 'inherit'
} as const;

export default function BoosterList() {
  const { data: packs, isLoading } = useGetAvailablePacksQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full items-center overflow-hidden">
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-75%) translateY(-100%); }
          100% { transform: translateX(25%) translateY(100%); }
        }
      `}</style>

      <h1 className="mb-4 text-center text-xl font-bold">Select a booster</h1>

      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="h-[min(420px,70vh)] w-[min(280px,85vw)] p-2 mb-[75px]"
      >
        {packs?.map((pack: BoosterPackDto) => (
          <SwiperSlide key={pack.id} className="rounded-xl overflow-hidden">
            <Link href={`/boosters/ouverture?type=${pack.id}`} className="w-full h-full block">
              <div className={`flex flex-col items-center justify-center ${getBoosterBackgroundColor(pack.type, pack.name)} h-full w-full relative rounded-xl shadow-md transition-transform hover:translate-y-[-3px] hover:shadow-lg overflow-hidden`}>

                <div className="absolute top-0 left-0 right-0 py-4 text-center uppercase tracking-wide border-b border-border bg-[rgba(0,0,0,0.3)] flex items-center justify-center gap-2">
                  <h3 className="text-background text-xl">Holomatch</h3>
                </div>

                <div style={shimmerStyle}></div>

                <div className="flex flex-col items-center justify-center h-full w-full pt-14 pb-4 px-4">
                  <div className="flex items-center justify-center w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full mb-2 shadow-inner border-2 border-white/30">
                    {getBoosterIcon(pack.type, pack.name)}
                  </div>
                  <h3 className="font-comic text-sm font-medium uppercase tracking-wider text-center text-white z-10">{pack.name}</h3>
                </div>

                <div className="absolute bottom-0 left-0 right-0 py-2 text-sm font-medium text-white text-center uppercase tracking-wide border-t border-border bg-[rgba(0,0,0,0.3)] flex items-center justify-center gap-2">
                  <span>{formatRelationshipTypeEnum(pack.type)}</span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
