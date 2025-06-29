import "./App.css";
import { Routes, Route } from "react-router";
import React, { JSX, useState } from "react";
import {
  CustomProvider,
  Heading,
  HeadingGroup,
  Stack,
  Text,
  Toggle,
  VStack,
} from "rsuite";
import LockFilePage from "./pages/lock-file.page";
import UnlockFilePage from "./pages/unlock-file.page";
import { useTranslation } from "react-i18next";
import HomePage from "./pages/home.page";
import { icons } from "./icons/icons";

const EMAIL = "9eoclzhztv8zyld@tutamail.com";

type Theme = "light" | "dark" | "high-contrast" | undefined;

function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const { t } = useTranslation();

  const onToggleTheme = (): void => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const isDark = (): boolean => {
    return theme === "dark";
  };

  const themeToggle = (): JSX.Element => {
    return (
      <Stack spacing={4}>
        <icons.lightTheme
          className={`${isDark() ? "visible" : "invisible"} text-2xl`}
        ></icons.lightTheme>
        <Toggle checked={theme === "dark"} onChange={onToggleTheme}></Toggle>
        <icons.darkTheme
          className={`${isDark() ? "invisible" : "visible"} text-2xl`}
        ></icons.darkTheme>
      </Stack>
    );
  };

  return (
    <CustomProvider theme={theme}>
      <div className="relative h-screen w-screen flex justify-center">
        <VStack className={"w-full"} alignItems="stretch">
          <div
            className={
              "flex justify-center items-center border-b border-gray-300 py-4 relative"
            }
          >
            <span className="absolute top-[89vh] sm:top-auto left-[40vw] sm:left-[90vw]">
              {themeToggle()}
            </span>
            <HeadingGroup className="text-center">
              <Heading level={2}>{t("pages.home.title")}</Heading>
              <Text muted as="i">
                {t("pages.home.sub_slogan")}
              </Text>
            </HeadingGroup>
          </div>
          <div className={"flex justify-center grow"}>
            <Routes>
              <Route path="/*" element={<HomePage />} />
              <Route path="/lock-file" element={<LockFilePage />} />
              <Route path="/unlock-file" element={<UnlockFilePage />} />
            </Routes>
          </div>
          <div className="flex items-center justify-center border-t border-gray-300 min-h-[5vw]">
            <Text muted weight="medium" size="xxl">
              {EMAIL}
            </Text>
          </div>
        </VStack>
      </div>
    </CustomProvider>
  );
}

export default App;
