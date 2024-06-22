'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from '@uploadthing/react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { useUploadThing } from '@/utils/uploadthing';
import { Upload } from 'lucide-react';
import RotateLoader from 'react-spinners/RotateLoader';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/router';
// import { revalidateUserProfile } from '@/app/actions';
import { revalidateUserProfile } from '@/app/actions/actions';

export function CustomUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, permittedFileInfo } = useUploadThing('profilePicture', {
    onClientUploadComplete: async () => {
      setIsUploading(false);
      setFiles([]);
      // Revalidate the user profile data
      await revalidateUserProfile();

      // Refresh the current route
    },
    onUploadError: () => {
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className={`absolute flex h-[200px] w-[200px] cursor-pointer justify-center self-center rounded-full bg-secondary p-2 transition-opacity ${
        isDragActive || isUploading
          ? 'opacity-100'
          : 'opacity-0 hover:opacity-80'
      }`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <RotateLoader
          color={'#ffffff'}
          loading={true}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
          className="self-center"
        />
      ) : (
        <Upload className="self-center transition-opacity" />
      )}
    </div>
  );
}
