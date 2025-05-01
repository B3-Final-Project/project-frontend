"use client";

import { useEffect, useState } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/react-query/profiles";

import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";

export function PicturesDialog() {
  const { data, isLoading } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const profile = data?.profile;
  const user = data?.user;

  const [images, setImages] = useState<string[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.images) {
      setImages(user.images);
    } else {
      setImages(Array(6).fill(null));
    }
  }, [profile, user]);

  const handleImageUpload = (index: number) => {
    setUploadingIndex(index);

    setTimeout(() => {
      const newImages = [...images];
      newImages[index] = `https://via.placeholder.com/150?text=Image+${index + 1}`;
      setImages(newImages);
      setUploadingIndex(null);

      toast({
        title: "Image uploaded",
        description: "Your profile image has been uploaded successfully.",
      });
    }, 1000);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = "";
    setImages(newImages);

    toast({
      title: "Image removed",
      description: "Your profile image has been removed.",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DialogContent>
      <DialogTitle>Profile Pictures</DialogTitle>
      <DialogDescription className="text-sm text-gray-500 mb-4">
        Add up to 6 photos to your profile. Drag to reorder.
      </DialogDescription>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="aspect-square border rounded-md relative overflow-hidden"
          >
            {imageUrl ? (
              <div className="relative h-full">
                <Image
                  src={imageUrl}
                  alt={`Profile ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="w-full h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => handleImageUpload(index)}
                disabled={uploadingIndex !== null}
              >
                {uploadingIndex === index ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-gray-800"></div>
                ) : (
                  <span className="text-2xl text-gray-400">+</span>
                )}
              </button>
            )}
          </div>
        ))}

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-2">
          Tips:
        </p>
        <ul className="text-sm text-gray-500 list-disc list-inside">
          <li>Clear photos of your face perform better</li>
          <li>Add photos showing your interests and personality</li>
          <li>Photos with friends can be great, but make sure it's clear which person is you</li>
        </ul>
      </div>
      </div>
    </DialogContent>
  );
}
