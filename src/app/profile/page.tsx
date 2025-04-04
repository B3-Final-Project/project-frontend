"use client";

import { Background } from "@/components/Background";
import { Camera, GalleryHorizontalEnd, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [sizeScreen, setSizeScreen] = useState(window.innerWidth);

  useEffect(() => {
    setSizeScreen(window.innerWidth);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        <div className="flex justify-between items-center gap-4 p-8">
          <Settings />

          <GalleryHorizontalEnd />
        </div>
        <div>
          <div className="w-[200%] h-[600px] bg-background rounded-t-[400px] rounded-b-none shadow-lg -ml-[50%] flex justify-center">
            <div
              className="flex flex-col items-center"
              style={{ width: `${sizeScreen}px` }}
            >
              <div className="w-[100px] h-[100px] border-4 border-background bg-red-500 rounded-full flex items-center justify-center -translate-y-1/2 overflow-hidden">
                <Image
                  src="/vintage.png"
                  alt="Profile"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className={`flex justify-between items-center w-full px-5`}>
                <h3>John Doe</h3>
                <Link
                  href="/"
                  className="text-sm bg-[#EFEFEF] px-3 py-1 rounded-md"
                >
                  Apercu
                </Link>
              </div>

              <div className="flex flex-col items-center gap-4 mt-10">
                <div className="flex items-center justify-between border border-border p-1 rounded-xl  w-[300px]">
                  <div className="flex items-center gap-4 p-2">
                    <Camera />
                    Photos
                  </div>
                  <div className="text-sm text-light-gray  p-2 ">1/6</div>
                </div>
                <div className="flex items-center justify-between border border-border p-1 rounded-xl  w-[300px]">
                  <div className="flex items-center gap-4 p-2">
                    <Camera />
                    Photos
                  </div>
                  <div className="text-sm text-light-gray  p-2 ">1/6</div>
                </div>
                <div className="flex items-center justify-between border border-border p-1 rounded-xl  w-[300px]">
                  <div className="flex items-center gap-4 p-2">
                    <Camera />
                    Photos
                  </div>
                  <div className="text-sm text-light-gray  p-2 ">1/6</div>
                </div>
                <div className="flex items-center justify-between border border-border p-1 rounded-xl  w-[300px]">
                  <div className="flex items-center gap-4 p-2">
                    <Camera />
                    Photos
                  </div>
                  <div className="text-sm text-light-gray  p-2 ">1/6</div>
                </div>
                <div className="flex items-center justify-between border border-border p-1 rounded-xl  w-[300px]">
                  <div className="flex items-center gap-4 p-2">
                    <Camera />
                    Photos
                  </div>
                  <div className="text-sm text-light-gray  p-2 ">1/6</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
