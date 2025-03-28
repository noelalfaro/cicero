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

export function CustomUpload({ user }: { user: User }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);

  const { startUpload, isUploading: isUploadingThing } = useUploadThing(
    'profilePicture',
    {
      onClientUploadComplete: async () => {
        setIsUploading(false);
        setFiles([]);
        setFileSizeError(false);
        // Revalidate the user profile data
        await revalidateUserProfile();

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

  return (
    <>
      <div className="flex w-full justify-center">
        <div
          {...getRootProps()}
          className={`relative flex h-[200px] w-[200px] cursor-pointer place-items-center justify-center rounded-full transition-opacity`}
        >
          <Image
            src={user.picture}
            alt={`${user?.username}.png`}
            // width={200}
            // height={200}
            fill={true}
            className={`h-auto rounded-full object-cover ${
              isDragActive || isUploading
                ? 'opacity-20'
                : 'opacity-100 hover:opacity-20'
            }`}
          />
          <div className="absolute flex h-[200px] w-[200px] items-center justify-center rounded-full bg-secondary opacity-0 transition-opacity hover:opacity-70">
            <Upload className="self-center transition-opacity" />
          </div>
        </div>

        <input {...getInputProps()} />
        {isUploading ? (
          <div className="absolute place-items-center self-center">
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
