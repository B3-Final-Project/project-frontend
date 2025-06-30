import { useGetAvailablePacksQuery } from "@/hooks/react-query/boosters";
import { BoosterPack } from "@/components/home/BoosterPack";
import { BoosterPackDto } from "@/lib/routes/booster/dto/booster.dto";

export default function BoosterList() {
  const { data: packs, isLoading } = useGetAvailablePacksQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-2xl font-bold mb-4">Available Booster Packs</h1>

      <ul className="flex flex-wrap gap-4 w-full px-4 md:px-0">
        {packs?.map((pack: BoosterPackDto) => (
          <BoosterPack key={pack.id} pack={pack} />
        ))}
      </ul>
    </div>
  );
}
