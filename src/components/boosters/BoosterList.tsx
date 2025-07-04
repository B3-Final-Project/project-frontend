import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Loader } from "@/components/Loader";
import { useGetAvailablePacksQuery } from "@/hooks/react-query/boosters";
import { BoosterPackDto } from "@/lib/routes/booster/dto/booster.dto";
import { formatRelationshipTypeEnum } from '@/lib/utils/enum-utils';
import { FaStar } from 'react-icons/fa';
import { GiWaterDrop, GiGrass, GiRock, GiMetalBar, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

export default function BoosterList() {
  const { data: packs, isLoading } = useGetAvailablePacksQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full items-center overflow-hidden">

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
              <div className={`flex flex-col items-center justify-center ${pack.name.toLowerCase().includes('water') ? 'bg-blue-500' :
                pack.name.toLowerCase().includes('grass') ? 'bg-emerald-700' :
                  pack.name.toLowerCase().includes('rock') ? 'bg-amber-700' :
                    pack.name.toLowerCase().includes('metal') ? 'bg-gray-600' :
                      pack.name.toLowerCase().includes('random') ? 'bg-purple-500' : 'bg-primary'} 
                               h-full w-full relative rounded-xl shadow-md transition-transform hover:translate-y-[-3px] hover:shadow-lg overflow-hidden`}>

                <div className="absolute top-0 left-0 right-0 py-4 text-center uppercase tracking-wide border-b border-border bg-[rgba(0,0,0,0.3)] flex items-center justify-center gap-2">
                  <h3 className="text-background text-xl">Holomatch</h3>
                </div>

                <div className="shimmer-effect"></div>

                <div className="flex flex-col items-center justify-center h-full w-full pt-14 pb-4 px-4">
                  <div className="flex items-center justify-center w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full mb-2 shadow-inner border-2 border-white/30">
                    {pack.name.toLowerCase().includes('water') ? <GiWaterDrop className="text-4xl text-blue-500" /> :
                     pack.name.toLowerCase().includes('grass') ? <GiGrass className="text-4xl text-emerald-700" /> :
                     pack.name.toLowerCase().includes('rock') ? <GiRock className="text-4xl text-amber-700" /> :
                     pack.name.toLowerCase().includes('metal') ? <GiMetalBar className="text-4xl text-gray-400" /> :
                     pack.name.toLowerCase().includes('random') ? <GiPerspectiveDiceSixFacesRandom className="text-4xl text-purple-500" /> :
                     <FaStar className="text-4xl text-amber-400" />}
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
