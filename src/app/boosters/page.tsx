"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import { StatusEnum } from "../../lib/utils/enum-status";
import {
  checkPackAvailability,
  clearPackOpenTimestamps,
} from "../../utils/packManager";

const BoosterVerificationPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.CHECKING);
  const [countdown, setCountdown] = useState(0);
  const { data: availablePacks, isLoading: isPacksLoading } = useGetAvailablePacksQuery();

  useEffect(() => {
    const { canOpen, timeUntilNextOpenMs } = checkPackAvailability();

    if (canOpen) {
      setStatus(StatusEnum.REDIRECTING);
      router.push('/boosters/list');
    } else {
      setCountdown(timeUntilNextOpenMs || 0);
      setStatus(StatusEnum.UNAVAILABLE);
    }
  }, [router]);

  useEffect(() => {
    if (status === StatusEnum.UNAVAILABLE && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else if (status === StatusEnum.UNAVAILABLE && countdown <= 0) {
      clearPackOpenTimestamps();
      setStatus(StatusEnum.REDIRECTING);
      router.push('/boosters/list');
    }
  }, [status, countdown]);


  if (status === StatusEnum.CHECKING || status === StatusEnum.REDIRECTING) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 sm:p-10 text-center my-5 mx-auto max-w-[600px] w-full">
        <Loader />
      </div>
    );
  }

  if (status === StatusEnum.UNAVAILABLE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 sm:p-10 text-center my-5 mx-auto max-w-[600px] w-full">
        <h1 className="telxt-2x sm:text-3xl text-slate-800 mb-5 sm:mb-6 font-semibold">
          Next booster available
        </h1>
        <p className="text-6xl sm:text-8xl  text-primary my-5 sm:my-6 mb-8 sm:mb-10 tracking-wider">
          {new Date(countdown).toISOString().substring(11, 19)}
        </p>
        <p className="text-base sm:text-lg text-slate-500">
          You will be redirected automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 sm:p-10 text-center my-5 mx-auto max-w-[600px] w-full">
      <Loader />
    </div>
  );
};

export default BoosterVerificationPage;
