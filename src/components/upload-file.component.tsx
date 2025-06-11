import React, { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./upload-file.component.css";
import { IconButton, Text, Input, VStack } from "rsuite";
import { icons } from "../icons/icons";

export default function UploadFileComponent({
  maxSize,
  onChange,
  iconSize,
  accept,
  showOnlyLbFileLabel,
}: {
  maxSize?: number | undefined;
  onChange: (file: File | null) => void;
  iconSize?: string;
  accept?: string | undefined;
  showOnlyLbFileLabel?: boolean | undefined;
}) {
  const el = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();
  const [showFileMaxSizeErrorKey, setShowFileMaxSizeErrorKey] =
    useState<number>(0);
  const [showFileMaxSizeError, setShowFileMaxSizeError] =
    useState<boolean>(false);
  const [filename, setFilename] = useState<string | undefined>(undefined);

  const checkFileSizeValidation = (value: File): boolean => {
    if (maxSize === undefined) return true;
    return value && value.size <= maxSize * 1024 * 1024;
  };

  const _onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files: FileList | null = event.target.files;
    const file: File | null = files != null ? files[0] : null;
    if (file != null && checkFileSizeValidation(file)) {
      setShowFileMaxSizeError(false);
      setFilename(file.name);
      onChange(file);
    } else {
      if (el.current != null) {
        el.current.value = "";
      }
      setFilename(undefined);
      onChange(null);
      setShowFileMaxSizeError(true);
    }
    setShowFileMaxSizeErrorKey((prev) => prev + 1);
  };

  const onClickUploadButton = (): void => {
    if (el.current != null) {
      el.current.click();
    }
  };

  const onAnimationEnd = (): void => {
    setShowFileMaxSizeError(false);
  };

  const onClickDeleteButton = (): void => {
    if (el.current != null) {
      el.current.value = "";
    }
    setFilename(undefined);
    onChange(null);
  };

  return (
    <>
      <VStack alignItems="center" justifyContent="center">
        {filename ? (
          <VStack className="grow" spacing={8} alignItems="center">
            <Text>{filename}</Text>
            <IconButton
              aria-label="delete-upload"
              apparence="secondary"
              onClick={onClickDeleteButton}
              icon={<icons.trash color="red" />}
            />
          </VStack>
        ) : (
          <>
            <IconButton
              aria-label="upload"
              appearance="link"
              onClick={onClickUploadButton}
              icon={<icons.upload className={iconSize} />}
            />
            <div className="hidden">
              <Input
                inputRef={el}
                type="file"
                onChangeCapture={_onChange}
                accept={accept}
              />
            </div>
          </>
        )}
        {showFileMaxSizeError && (
          <>
            <Text
              size="sm"
              color="red"
              key={showFileMaxSizeErrorKey}
              onAnimationEnd={onAnimationEnd}
              className="file-size-error-msg file-size-error-msg-fade-out"
            >
              {t("components.upload_file.upload_file_max_size_error")}
            </Text>
          </>
        )}
        {!showFileMaxSizeError && maxSize && (
          <>
            <Text muted>
              {t("components.upload_file.upload_file_max_size", { maxSize })}
            </Text>
          </>
        )}
        {!showFileMaxSizeError && showOnlyLbFileLabel && (
          <>
            <Text muted>{t("components.upload_file.only_lb_file")}</Text>
          </>
        )}
      </VStack>
    </>
  );
}
