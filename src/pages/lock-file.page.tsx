import React, { JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import UploadFile from "../components/upload-file.component";
import {
  Divider,
  VStack,
  Heading,
  IconButton,
  Progress,
  DatePicker,
  Form,
  Button,
  HStack,
  Text,
} from "rsuite";
import { LockFilService } from "../services/lock.rest.service";
import { fromBase64, toBase64 } from "../utils/file.utils";
import DownloadFileComponent, {
  FileDownload,
} from "../components/download-file.component";
import { ValidatorUtils } from "../utils/validator.utils";
import { useNavigate } from "react-router";
import { icons } from "../icons/icons";
import { roundHalfDown } from "../utils/math.utils";
import { MAX_FILE_SIZE } from "../commons/commons";
import PasswordInput from "../components/password-input.component";

const now: Date = new Date();

interface IFormInput {
  file: File | null;
  expiryDate: Date | null;
  secret: string | null;
}

enum VIEW {
  UPLOAD = "UPLOAD",
  SUBMITTING = "SUBMITTING",
  ERROR = "ERROR",
  DOWNLOAD = "DOWNLOAD",
}

export default function LockFilePage() {
  const form = useForm<IFormInput>({
    mode: "onTouched",
    defaultValues: {
      file: null,
      expiryDate: null,
      secret: null,
    },
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentView, setCurrentView] = useState<VIEW>(VIEW.UPLOAD);
  const [fileDownload, setFileDownload] = useState<FileDownload | undefined>(
    undefined,
  );
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const validatorUtilsRef = useRef(new ValidatorUtils<IFormInput>());

  validatorUtilsRef.current.formState = form.formState;

  const validatorUtils: () => ValidatorUtils<IFormInput> = () =>
    validatorUtilsRef.current;

  useEffect(() => {
    form.register("file", {
      required: t("commons.errors.required"),
    });
    form.trigger().then();
  }, []);

  const onSubmit: SubmitHandler<IFormInput> = async (
    formData: IFormInput,
  ): Promise<void> => {
    if (form.formState.isValid) {
      if (
        formData == null ||
        formData.file == null ||
        formData.expiryDate == null ||
        formData.secret == null
      ) {
        return;
      }
      const payload = {
        filename: formData.file.name,
        data: (await toBase64(formData.file)) as string,
        expiryDate: formData.expiryDate,
        secret: formData.secret,
      };
      LockFilService.lockFile(payload, (loaded) =>
        setProgress(loaded ? roundHalfDown(loaded * 100, 2) : 0),
      )
        .then((resp: { filename: string; data: string }) => {
          setProgress(0);
          setFileDownload({
            filename: resp.filename,
            blob: new Blob([fromBase64(resp.data)]),
          });
          setCurrentView(VIEW.DOWNLOAD);
        })
        .catch((e) => {
          setProgress(0);
          setServerError(e.response.data.error ?? "UNKNOW");
          setCurrentView(VIEW.ERROR);
        });
      setCurrentView(VIEW.SUBMITTING);
    }
  };

  /**
   * Returns a default calendar date set to one minute in the future.
   * This is used as the default value for the expiration date picker.
   *
   * @returns {Date} A `Date` object representing the default calendar date.
   */
  const getDefaultCalendarDate = (): Date => {
    return new Date(new Date().getTime() + 60000);
  };

  const onClickLockNewFileBtn = (): void => {
    form.reset();
    setCurrentView(VIEW.UPLOAD);
  };

  const lockNewFileBtn = (): JSX.Element => {
    return (
      <div className="mt-3">
        <Button
          type="button"
          appearance="primary"
          onClick={onClickLockNewFileBtn}
        >
          {t("pages.lock.lock_new_file_btn_label")}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex h-full w-[90vw] lg:w-[40vw] shadow-md border border-gray-300 rounded-lg p-2">
      <VStack
        className="grow"
        alignItems="stretch"
        spacing={0}
        divider={<Divider className="my-6!" />}
      >
        <div className="flex items-center justify-center relative mt-6">
          <div className="absolute right-[80%] md:right-[85%]">
            <Button
              type="button"
              appearance="default"
              onClick={() => navigate("/")}
            >
              {t("commons.buttons.go_home")}
            </Button>
          </div>
          <Heading level={2}>{t("pages.lock.title")}</Heading>
        </div>
        <VStack
          className="grow"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <>
            {currentView === VIEW.UPLOAD && (
              <>
                <VStack.Item alignSelf="stretch">
                  <HStack spacing={0}>
                    <HStack.Item className="min-w-[50%]">
                      <UploadFile
                        iconSize="text-5xl"
                        maxSize={MAX_FILE_SIZE}
                        onChange={(file: File | null) =>
                          form.setValue("file", file, { shouldValidate: true })
                        }
                      />
                    </HStack.Item>
                    <VStack alignItems="stretch" spacing={36}>
                      <Controller
                        name="expiryDate"
                        control={form.control}
                        rules={{
                          required: t("commons.errors.required"),
                          validate: {
                            pastDate: (value: Date | null) => {
                              return value && value < new Date()
                                ? t("pages.lock.expiration_datetime_error")
                                : undefined;
                            },
                          },
                        }}
                        render={({ field }) => (
                          <Form.Group>
                            <DatePicker
                              className="w-full"
                              id={field.name}
                              value={field.value}
                              placeholder={t("pages.lock.expiration_datetime")}
                              format="dd/MM/yyyy HH:mm"
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              calendarDefaultDate={getDefaultCalendarDate()}
                              shouldDisableDate={(date) =>
                                date.getTime() < now.setHours(0, 0, 0, 0)
                              }
                              shouldDisableHour={(hour: number, date: Date) =>
                                date.getDate() === now.getDate() &&
                                hour < now.getHours()
                              }
                              shouldDisableMinute={(
                                minute: number,
                                date: Date,
                              ) =>
                                date.getDate() === now.getDate() &&
                                date.getHours() === now.getHours() &&
                                minute <= now.getMinutes()
                              }
                            />
                            <Form.ErrorMessage
                              show={validatorUtils().showError(field.name)}
                              placement="bottomStart"
                            >
                              {validatorUtils().getError(field.name)}
                            </Form.ErrorMessage>
                          </Form.Group>
                        )}
                      />
                      <Controller
                        name="secret"
                        control={form.control}
                        rules={{ required: "Secret is required" }}
                        render={({ field }) => (
                          <Form.Group>
                            {/*<Form.ControlLabel>Secret</Form.ControlLabel>*/}
                            <PasswordInput
                              field={{
                                name: field.name,
                                value: field.value || "",
                                onChange: field.onChange,
                                onBlur: field.onBlur,
                                placeholder: t(
                                  "pages.unlock.secret_placeholder",
                                ),
                              }}
                            />
                            <Form.ErrorMessage
                              show={validatorUtils().showError("secret")}
                              placement="bottomStart"
                            >
                              {validatorUtils().getError("secret")}
                            </Form.ErrorMessage>
                          </Form.Group>
                        )}
                      />
                    </VStack>
                    <div className="sm:me-8 md:me-12"></div>
                  </HStack>
                </VStack.Item>
              </>
            )}
            {currentView === VIEW.SUBMITTING && (
              <>
                <div
                  style={{
                    width: 100,
                    display: "inline-block",
                  }}
                >
                  <Progress.Circle
                    percent={progress}
                    status={progress === 100 ? `success` : undefined}
                  />
                </div>
              </>
            )}
            {currentView === VIEW.DOWNLOAD && (
              <>
                {fileDownload != null && (
                  <>
                    <VStack spacing={20} alignItems="center">
                      <DownloadFileComponent file={fileDownload} />
                      <Text muted weight="light" size="sm">
                        {t("pages.lock.share_lb")}
                      </Text>
                      <div>{lockNewFileBtn()}</div>
                    </VStack>
                  </>
                )}
              </>
            )}
            {currentView === VIEW.ERROR && (
              <>
                <icons.error color="red" className="text-7xl" />
                <Heading color="red" level={4}>
                  {t(`server_errors.${serverError}`)}
                </Heading>
                <div className="mt-3">{lockNewFileBtn()}</div>
              </>
            )}
          </>
        </VStack>
        <VStack.Item alignSelf="center">
          <div className="mb-4">
            {currentView === VIEW.UPLOAD && (
              <>
                <IconButton
                  className="w-30"
                  size="lg"
                  appearance="primary"
                  aria-label="lock"
                  disabled={!form.formState.isValid}
                  onClick={form.handleSubmit(onSubmit)}
                  icon={<icons.lock />}
                />
              </>
            )}
          </div>
        </VStack.Item>
      </VStack>
    </div>
  );
}
