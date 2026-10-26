import type { ComponentType } from "react";
import type { NavPath } from "@/app.config";
import DashboardPage from "@/pages/DashboardPage";
import DocumentsPage from "@/pages/documents/DocumentsPage";
import SettingsPage from "@/pages/SettingsPage";

// app.config.ts の navigation の URL ごとに表示する画面。
// navigation に項目を足してここに画面を足さないと（またはその逆だと）型エラーになり、URL のずれを防ぐ。
export const pageByPath: Record<NavPath, ComponentType> = {
    "/": DashboardPage,
    "/documents": DocumentsPage,
    "/settings": SettingsPage,
};
