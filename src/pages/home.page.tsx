import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import React from "react";
import { Button, Heading, VStack } from "rsuite";
import { icons } from "../icons/icons";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <VStack spacing={100} className={"mt-[3%]"} alignItems={"center"}>
      <Heading>{t("pages.home.slogan")}</Heading>
      <VStack
        spacing={25}
        className={"mt-[15%] max-w-50"}
        alignItems={"stretch"}
      >
        <Button
          type="button"
          appearance="primary"
          size="lg"
          className={"w-full"}
          onClick={() => navigate("/lock-file")}
          endIcon={<icons.lock className="ms-2 text-2xl" />}
        >
          {t("pages.home.lock_file")}
        </Button>
        <Button
          type="button"
          appearance="primary"
          size="lg"
          className={"w-full"}
          onClick={() => navigate("/unlock-file")}
          endIcon={<icons.unlock className="ms-2 text-2xl" />}
        >
          {t("pages.home.unlock_file")}
        </Button>
      </VStack>
    </VStack>
  );
}
