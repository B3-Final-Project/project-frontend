"use client";

import { Background } from "@/components/Background";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Book,
  Camera,
  Circle,
  GalleryHorizontalEnd,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [sizeScreen, setSizeScreen] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    setSizeScreen(window.innerWidth);

    const handleResize = () => {
      setSizeScreen(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const editProfileData = {
    pictures: {
      title: "Photos",
      description: "1/6",
      icon: Camera,
    },
    description: {
      title: "Description",
      description: "Description",
      icon: Book,
    },
    genre: {
      title: "Genre",
      description: "Description",
      icon: Circle,
    },
    preferences: {
      title: "Préférences",
      description: "Description",
      icon: Circle,
    },
    others: {
      title: "Autres",
      description: "Description",
      icon: MoreHorizontal,
    },
  };

  const renderDialogContent = () => {
    switch (selectedOption) {
      case "pictures":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Photos</DialogTitle>
              <DialogDescription>
                Ajoutez jusqu&apos;à 6 photos à votre profil
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 py-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer"
                >
                  <Camera className="text-gray-400" />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
          </>
        );
      case "description":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Description</DialogTitle>
              <DialogDescription>Parlez un peu de vous</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Écrivez votre description ici..."
                className="min-h-[150px]"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
          </>
        );
      case "genre":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Genre</DialogTitle>
              <DialogDescription>Définissez votre genre</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="gender">Genre</Label>
                <select id="gender" className="p-2 border rounded-md">
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="non-binaire">Non-binaire</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
          </>
        );
      case "preferences":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Préférences</DialogTitle>
              <DialogDescription>Définissez vos préférences</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="looking-for">Je recherche</Label>
                <select id="looking-for" className="p-2 border rounded-md">
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="tous">Tous</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Tranche d&apos;âge</Label>
                <div className="flex gap-4 items-center">
                  <Input
                    type="number"
                    min="18"
                    placeholder="18"
                    className="w-20"
                  />
                  <span>à</span>
                  <Input
                    type="number"
                    min="18"
                    placeholder="99"
                    className="w-20"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
          </>
        );
      case "others":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Autres informations</DialogTitle>
              <DialogDescription>Complétez votre profil</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  placeholder="Votre nom"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Âge
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  placeholder="25"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Ville
                </Label>
                <Input
                  id="location"
                  placeholder="Paris"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        <div className="flex justify-between items-center gap-4 p-8">
          <Settings />

          <GalleryHorizontalEnd />
        </div>
        <div>
          <div className="w-[200%] h-[600px] md:h-[800px] bg-background rounded-t-[400px] rounded-b-none shadow-lg -ml-[50%] flex justify-center">
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

              <div
                className={`flex justify-between items-center w-full  max-w-[300px]`}
              >
                <h3 className="text-2xl font-bold">John Doe</h3>
                <Link
                  href="/user-card"
                  className="text-sm bg-[#EFEFEF] px-3 py-1 rounded-md"
                >
                  Aperçu
                </Link>
              </div>

              <Dialog>
                <div className="flex flex-col items-center gap-4 mt-10 w-full">
                  {Object.entries(editProfileData).map(([key, value]) => (
                    <DialogTrigger
                      key={key}
                      asChild
                      onClick={() => setSelectedOption(key)}
                    >
                      <Button
                        variant="secondary"
                        className="flex items-center justify-between w-full max-w-[300px]"
                      >
                        <div className="flex items-center gap-4">
                          <value.icon />
                          {value.title}
                        </div>
                      </Button>
                    </DialogTrigger>
                  ))}
                </div>
                <DialogContent className="sm:max-w-[425px]">
                  {renderDialogContent()}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
