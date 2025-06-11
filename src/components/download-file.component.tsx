import React, { useEffect, useState } from "react";
import "./upload-file.component.css";
import { HStack, IconButton, VStack } from "rsuite";
import { Text } from "rsuite";
import { icons } from "../icons/icons";

export interface FileDownload {
  filename: string;
  blob: Blob;
}

export default function DownloadFileComponent({
  file,
}: {
  file: FileDownload;
}) {
  const [filesize, setFilesize] = useState<string | undefined>(undefined);

  useEffect(() => {
    const blobSizeInKB = (file.blob.size / 1024).toFixed(2); // Compute size in KB
    setFilesize(blobSizeInKB);
  }, []);

  const onClickDownloadFile = (): void => {
    const url = URL.createObjectURL(file.blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <VStack alignItems="center">
        <IconButton
          aria-label="download"
          appearance="link"
          onClick={onClickDownloadFile}
          icon={<icons.download className="text-3xl" />}
        />
        <HStack spacing={4}>
          <Text weight="thin">{file.filename}</Text>
          <Text weight="thin" muted size="sm">
            ({filesize}KB)
          </Text>
        </HStack>
      </VStack>
    </>
  );
}
