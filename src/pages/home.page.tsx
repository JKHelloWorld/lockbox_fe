import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import React from "react";
import { Button, Heading, Text, VStack } from "rsuite";
import { icons } from "../icons/icons";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="mt-10">
      <VStack spacing={80} alignItems={"center"}>
        <Heading>{t("pages.home.slogan")}</Heading>
        <VStack spacing={25} className="max-w-50" alignItems="stretch">
          <Button
            type="button"
            appearance="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate("/lock-file")}
            endIcon={<icons.lock className="ms-2 text-2xl" />}
          >
            {t("pages.home.lock_file")}
          </Button>
          <Button
            type="button"
            appearance="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate("/unlock-file")}
            endIcon={<icons.unlock className="ms-2 text-2xl" />}
          >
            {t("pages.home.unlock_file")}
          </Button>
          <Text muted weight="light" size="xs">
            {t("pages.home.disclaimer")}
          </Text>
        </VStack>
      </VStack>
    </div>
  );
}
