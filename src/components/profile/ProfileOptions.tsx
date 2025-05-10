'use client'
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

interface ProfileOptionsProps {
  readonly data: {key: string, icon: React.ComponentType, description: string, title: string}[],
  readonly setSelectedOption: (option: string) => void;
}

export function ProfileOptions({ data, setSelectedOption }: ProfileOptionsProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-10 w-full">
      {data.map((item) => (
        <DialogTrigger key={item.key} asChild onClick={() => setSelectedOption(item.key)}>
          <Button
            variant="secondary"
            className="flex items-center justify-between w-full max-w-[300px]"
          >
            <div className="flex items-center gap-4">
              <item.icon />
              {item.title}
            </div>
          </Button>
        </DialogTrigger>
      ))}
    </div>
  );
}
