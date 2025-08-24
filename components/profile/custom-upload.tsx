'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from '@uploadthing/react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { useUploadThing } from '@/server/utils/uploadthing';
import { Upload } from 'lucide-react';
import RotateLoader from 'react-spinners/RotateLoader';

import { revalidateUserProfile } from '@/app/(main)/actions/actions';
import { User } from '@/lib/definitions';
import Image from 'next/image';
import React from 'react';

interface CustomUploadProps {
  currentImageUrl: string | null | undefined;
  altText: string;
  onUploadComplete: (url: string) => void;
}

export function CustomUpload({
  currentImageUrl,
  altText,
  onUploadComplete,
}: CustomUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);

  const { startUpload, isUploading: isUploadingThing } = useUploadThing(
    'profilePicture',
    {
      onClientUploadComplete: (res) => {
        setIsUploading(false);
        // setFiles([]);
        setFileSizeError(false);
        // Revalidate the user profile data
        // await revalidateUserProfile();
        if (res && res.length > 0) {
          // We report back with the new URL. That's it. Our job is done.
          onUploadComplete(res[0].ufsUrl);
        }
        // Refresh the current route
      },
      onUploadError: (error: Error) => {
        setIsUploading(false);
        if (error.message === 'Invalid config: FileSizeMismatch')
          setFileSizeError(true);
        // setFileSizeError(false);
      },
      onUploadBegin: () => {
        setIsUploading(true);
      },
    },
  );

  const fileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(fileTypes),
  });
  const displayImageUrl =
    currentImageUrl ||
    'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg';

  return (
    <>
      <div className="flex justify-center">
        <div
          {...getRootProps()}
          className={`relative flex h-[175px] w-[175px] cursor-pointer place-items-center justify-center overflow-hidden rounded-full object-cover transition-opacity md:h-[200px] md:w-[200px] lg:h-[225px] lg:w-[225px]`}
        >
          <Image
            src={displayImageUrl}
            alt={altText}
            // width={}
            // height={200}
            fill={true}
            className={`${
              isDragActive || isUploading
                ? 'opacity-20'
                : 'opacity-100 hover:opacity-20'
            }`}
          />
          <div className="bg-secondary absolute flex h-[175px] w-[175px] items-center justify-center rounded-full opacity-0 transition-opacity hover:opacity-70 md:h-[200px] md:w-[200px] lg:h-[225px] lg:w-[225px]">
            <Upload className="self-center transition-opacity" />
          </div>
        </div>

        <input {...getInputProps()} />
        {isUploading ? (
          <div className="absolute place-items-center justify-center self-center">
            <RotateLoader
              color={'#ffffff'}
              loading={true}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="self-center"
            />
          </div>
        ) : null}
      </div>
      {fileSizeError ? (
        <p className="relative text-center font-semibold text-red-600">
          File Size Too Big
        </p>
      ) : null}
    </>
  );
}
