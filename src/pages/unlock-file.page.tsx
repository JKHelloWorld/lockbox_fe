import React, { JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import UploadFile from "../components/upload-file.component";
import {
  Button,
  Divider,
  Form,
  Heading,
  IconButton,
  Input,
  Progress,
  Stack,
  VStack,
} from "rsuite";
import DownloadFileComponent, {
  FileDownload,
} from "../components/download-file.component";
import { UnlockRestService } from "../services/unlock.rest.service";
import { fromBase64, toBase64 } from "../utils/file.utils";
import { ValidatorUtils } from "../utils/validator.utils";
import { icons } from "../icons/icons";
import { useNavigate } from "react-router";
import { roundHalfDown } from "../utils/math.utils";
import PasswordInput from "../components/password-input.component";

const MAX_FILE_SIZE = 1; // MB

interface IFormInput {
  file: File | null;
  secret: string | null;
}

enum VIEW {
  UPLOAD = "UPLOAD",
  SUBMITTING = "SUBMITTING",
  ERROR = "ERROR",
  DOWNLOAD = "DOWNLOAD",
}

export default function UnlockFilePage() {
  const form = useForm<IFormInput>({
    mode: "onTouched",
    defaultValues: {
      file: null,
      secret: null,
    },
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentView, setCurrentView] = useState<VIEW>(VIEW.UPLOAD);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [fileDownload, setFileDownload] = useState<FileDownload | undefined>(
    undefined,
  );
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
        formData.secret == null
      ) {
        return;
      }
      UnlockRestService.unlockFile(
        {
          data: (await toBase64(formData.file)) as string,
          secret: formData.secret,
        },
        (loaded) => setProgress(loaded ? roundHalfDown(loaded * 100, 2) : 0),
      )
        .then((resp: { filename: string; data: string }) => {
          setFileDownload({
            filename: resp.filename,
            blob: new Blob([fromBase64(resp.data)]),
          });
          setCurrentView(VIEW.DOWNLOAD);
        })
        .catch((e) => {
          setServerError(e.response.data.error ?? "UNKNOW");
          setCurrentView(VIEW.ERROR);
        });
      setCurrentView(VIEW.SUBMITTING);
    }
  };

  const onClickUnlockNewFileBtn = (): void => {
    form.reset();
    setCurrentView(VIEW.UPLOAD);
  };

  const unlockNewFileBtn = (): JSX.Element => {
    return (
      <div className="mt-3">
        <Button
          type="button"
          appearance="primary"
          onClick={onClickUnlockNewFileBtn}
        >
          {t("pages.unlock.unlock_new_file_btn_label")}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex m-auto min-w-[90vw] sm:min-w-[40vw] min-h-[50vh] shadow-md border border-gray-300 rounded-lg p-2">
      <VStack
        className="grow"
        alignItems="stretch"
        spacing={2}
        divider={<Divider />}
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
          <Heading level={2}>{t("pages.unlock.title")}</Heading>
        </div>
        <VStack
          className="h-[30vh]"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          {currentView === VIEW.UPLOAD && (
            <>
              <VStack.Item alignSelf="stretch">
                <Stack className="grow">
                  <Stack.Item grow={1}>
                    <UploadFile
                      accept=".lb"
                      iconSize="text-5xl"
                      onChange={(file: File | null) =>
                        form.setValue("file", file, { shouldValidate: true })
                      }
                      showOnlyLbFileLabel={true}
                    />
                  </Stack.Item>
                  <VStack alignItems="stretch" className="mx-8" spacing={36}>
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
                              placeholder: t("pages.unlock.secret_placeholder"),
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
                </Stack>
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
                  <DownloadFileComponent file={fileDownload} />
                  <div className="mt-3">{unlockNewFileBtn()}</div>
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
              <div className="mt-3">{unlockNewFileBtn()}</div>
            </>
          )}
        </VStack>
        <div className="flex justify-center mb-4">
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
      </VStack>
    </div>
  );
}
