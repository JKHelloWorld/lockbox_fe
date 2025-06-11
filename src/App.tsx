import "./App.css";
import { Routes, Route } from "react-router";
import React, { JSX, useState } from "react";
import {
  CustomProvider,
  Divider,
  Heading,
  HeadingGroup,
  HStack,
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
  const [theme, setTheme] = useState<Theme>("light");
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
      <HStack spacing={4}>
        <icons.lightTheme
          className={`${isDark() ? "visible" : "invisible"} text-2xl`}
        ></icons.lightTheme>
        <Toggle checked={theme === "dark"} onChange={onToggleTheme}></Toggle>
        <icons.darkTheme
          className={`${isDark() ? "invisible" : "visible"} text-2xl`}
        ></icons.darkTheme>
      </HStack>
    );
  };

  return (
    <CustomProvider theme={theme}>
      <div className="h-screen w-screen flex justify-center">
        <VStack
          className="w-full"
          alignItems="stretch"
          spacing={0}
          divider={<Divider className="my-4!" />}
        >
          <VStack.Item alignSelf="center">
            <VStack className="mt-3">
              <HeadingGroup className="text-center m-0!">
                <div className="relative">
                  <Heading level={2}>{t("pages.home.title")}</Heading>
                  <div className="hidden sm:block absolute top-[25%] left-[70%]">
                    {themeToggle()}
                  </div>
                </div>
                <Text muted as="i">
                  {t("pages.home.sub_slogan")}
                </Text>
              </HeadingGroup>
              <VStack.Item className="sm:hidden" alignSelf="center">
                {themeToggle()}
              </VStack.Item>
            </VStack>
          </VStack.Item>
          <VStack.Item grow={1} alignSelf="center">
            <Routes>
              <Route path="/*" element={<HomePage />} />
              <Route path="/lock-file" element={<LockFilePage />} />
              <Route path="/unlock-file" element={<UnlockFilePage />} />
            </Routes>
          </VStack.Item>
          <VStack.Item alignSelf="center">
            <div className="mb-4">
              <Text muted weight="medium" size="xxl">
                {EMAIL}
              </Text>
            </div>
          </VStack.Item>
        </VStack>
      </div>
    </CustomProvider>
  );
}

export default App;
