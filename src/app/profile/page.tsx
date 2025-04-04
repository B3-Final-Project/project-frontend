import { Background } from "@/components/Background";
import { GalleryHorizontalEnd, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        <div className="flex justify-between items-center gap-4 p-8">
          <Settings />

          <GalleryHorizontalEnd />
        </div>
        <div>
          <div className="w-[200%] h-[500px] bg-background rounded-t-[400px] rounded-b-none shadow-lg -ml-[50%] flex justify-center">
            <div className="flex flex-col items-center w-full">
              <div className="w-[100px] h-[100px] border-4 border-background bg-red-500 rounded-full flex items-center justify-center -translate-y-1/2 overflow-hidden">
                <Image
                  src="/vintage.png"
                  alt="Profile"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex justify-between items-center ">
                <h3>John Doe</h3>
                <Link
                  href="/"
                  className="text-sm bg-light-gray  p-2 rounded-sm"
                >
                  Apercu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
