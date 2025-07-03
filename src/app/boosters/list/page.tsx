'use client';

import { Loader } from "@/components/Loader";
import BoosterList from "@/components/boosters/BoosterList";
import { useGetAvailablePacksQuery } from "@/hooks/react-query/boosters";
import { checkPackAvailability } from "@/utils/packManager";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoosterListPage() {
  const router = useRouter();
  const { data: packs, isLoading } = useGetAvailablePacksQuery();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const { canOpen } = checkPackAvailability();

    if (!canOpen) {
      router.push('/boosters');
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (isLoading || !isVerified) {
    return <Loader />
  }

  if (!packs || packs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
        <h1 className="text-2xl sm:text-3xl text-slate-800 mb-4 font-semibold">No boosters available</h1>
        <p className="text-gray-500">Check back later for new boosters</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full max-h-screen overflow-hidden py-2 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BoosterList />
    </motion.div>
  );
}
