"use client";

import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCallback, useMemo, useRef, useState } from "react";
import { useImageMutations, useProfileQuery } from "@/hooks/react-query/profiles";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

const MAX_IMAGES = 6;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function PicturesDialog() {
  const { data, isLoading } = useProfileQuery();
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const { uploadImage, removeImage, isUploading, isRemoving } = useImageMutations();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const profile = data?.profile;

  const currentImages = useMemo(() => {
    const images = profile?.images ?? [];
    const paddedImages: (string | null)[] = images.slice(0, MAX_IMAGES);
    while (paddedImages.length < MAX_IMAGES) {
      paddedImages.push(null);
    }
    return paddedImages;
  }, [profile?.images]);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, or WebP).";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB.";
    }
    return null;
  }, []);

  const handleFileChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast({ title: "Invalid file", description: validationError, variant: "destructive" });
      return;
    }

    setUploadingIndex(index);

    uploadImage({
      profileId: profile.id,
      file,
      index
    }, {
      onSuccess: () => toast({ title: "Image uploaded" }),
      onError: () => toast({ title: "Upload failed", variant: "destructive" }),
      onSettled: () => setUploadingIndex(null),
    });

    e.target.value = '';
  }, [validateFile, uploadImage, profile]);

  const handleImageUpload = useCallback((index: number) => {
    inputRefs.current[index]?.click();
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    if (!profile?.id) return;
    const imageObj = currentImages[index];
    if (!imageObj) return;

    setRemovingIndex(index);

    removeImage(
      { profileId: profile.id, index },
      {
        onSuccess: () => toast({ title: "Image removed" }),
        onError: () => toast({ title: "Remove failed", variant: "destructive" }),
        onSettled: () => setRemovingIndex(null),
      }
    );
  }, [removeImage, profile?.id, currentImages]);

  if (isLoading) {
    return (
      <DialogContent>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-400 border-t-gray-800"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </DialogContent>
    );
  }

  if (!profile) {
    return (
      <DialogContent>
        <DialogTitle>Error</DialogTitle>
        <DialogDescription>Profile not found. Please try again later.</DialogDescription>
      </DialogContent>
    );
  }

  const ImageSlot = ({ index }: { index: number }) => {
    const imageUrl = currentImages[index];
    const isCurrentlyUploading = uploadingIndex === index;
    const isCurrentlyRemoving = removingIndex === index;
    const isDisabled = isCurrentlyUploading || isCurrentlyRemoving || isUploading || isRemoving;

    return (
      <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors group">
        <input
          //@ts-expect-error - ref is not assignable to input element
          ref={el => inputRefs.current[index] = el}
          id={`profile-image-input-${index}`}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={(e) => handleFileChange(e, index)}
          className="hidden"
          disabled={isDisabled}
        />

        {imageUrl ? (
          <div className="relative h-full group">
            <Image
              src={imageUrl}
              alt={`Profile ${index + 1}`}
              className="object-cover w-full h-full"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {(isCurrentlyRemoving || isCurrentlyUploading) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                {isCurrentlyUploading && (
                  <span className="ml-2 text-white text-xs">Uploading...</span>
                )}
              </div>
            )}
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
              onClick={() => handleRemoveImage(index)}
              disabled={isDisabled}
              aria-label={`Remove image ${index + 1}`}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <button
              type="button"
              className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
              onClick={() => handleImageUpload(index)}
              disabled={isDisabled}
            >
              Replace
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="w-full h-full flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleImageUpload(index)}
            disabled={isDisabled}
            aria-label={`Upload image ${index + 1}`}
          >
            {isCurrentlyUploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-gray-800 mb-2"></div>
                <span className="text-xs text-gray-500">Uploading...</span>
              </>
            ) : (
              <>
                <span className="text-3xl text-gray-400 mb-1">+</span>
                <span className="text-xs text-gray-500">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogTitle>Profile Pictures</DialogTitle>
      <DialogDescription className="text-sm text-gray-500 mb-4">
        Add up to {MAX_IMAGES} photos to your profile. The first photo will be your main profile picture.
      </DialogDescription>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: MAX_IMAGES }, (_, index) => (
          <ImageSlot key={index} index={index} />
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex gap-2 items-start">
        <Info className="text-blue-400 w-5 h-5 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 mb-2">Photo Tips:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Clear photos of your face perform better</li>
            <li>• Add photos showing your interests and personality</li>
            <li>• Photos with friends can be great, but make sure it&#39;s clear which person is you</li>
            <li>• Use high-quality images (JPEG, PNG, or WebP format)</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  );
}
