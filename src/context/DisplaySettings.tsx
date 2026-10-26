import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { appConfig } from "@/app.config";
import { formatDateTime, type DateDisplay } from "@/lib/format";

// 設定画面の選択肢。
export const LOCALE_OPTIONS = [
    { value: "ja-JP", label: "日本（年/月/日 24時間）" },
    { value: "en-US", label: "米国（月/日/年 12時間）" },
    { value: "en-GB", label: "英国（日/月/年 24時間）" },
] as const;

export const TIME_ZONE_OPTIONS = ["Asia/Tokyo", "UTC", "America/New_York", "Europe/London"] as const;

export const STORAGE_KEY = "display-settings";

type DisplaySettingsValue = {
    settings: DateDisplay;
    setSettings: (next: DateDisplay) => void;
    /** 現在の設定で日時を表示する。 */
    formatDateTime: (iso: string) => string;
};

const DisplaySettingsContext = createContext<DisplaySettingsValue | null>(null);

export function useDisplaySettings(): DisplaySettingsValue {
    const ctx = useContext(DisplaySettingsContext);
    if (!ctx) throw new Error("useDisplaySettings は DisplaySettingsProvider の内側で使ってください");
    return ctx;
}

function isOption<T extends string>(options: readonly T[], value: unknown): value is T {
    return typeof value === "string" && (options as readonly string[]).includes(value);
}

const LOCALE_VALUES = LOCALE_OPTIONS.map((o) => o.value);

// 保存値はブラウザごとの好みなので localStorage に置く。読めない環境では既定値で動く。
// 古い版や手で書き換えた値が残っていると Intl.DateTimeFormat が例外を投げて画面全体が落ちるため、
// 選択肢にある値だけを採用し、それ以外は項目ごとに既定値へ戻す。
export function loadDisplaySettings(): DateDisplay {
    const fallback = appConfig.display;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return fallback;
        const saved: unknown = JSON.parse(raw);
        if (typeof saved !== "object" || saved === null) return fallback;
        const { locale, timeZone } = saved as Record<string, unknown>;
        return {
            locale: isOption(LOCALE_VALUES, locale) ? locale : fallback.locale,
            timeZone: isOption(TIME_ZONE_OPTIONS, timeZone) ? timeZone : fallback.timeZone,
        };
    } catch {
        // localStorage が使えない環境や、JSON として読めない値の場合は既定値にする。
        return fallback;
    }
}

// 日付の表示形式（ロケール・タイムゾーン）を画面全体で共有する。
export function DisplaySettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettingsState] = useState<DateDisplay>(loadDisplaySettings);

    const setSettings = useCallback((next: DateDisplay) => {
        setSettingsState(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // 保存できなくても、このタブの間は反映される。
        }
    }, []);

    const value = useMemo<DisplaySettingsValue>(
        () => ({ settings, setSettings, formatDateTime: (iso) => formatDateTime(iso, settings) }),
        [settings, setSettings],
    );

    return <DisplaySettingsContext.Provider value={value}>{children}</DisplaySettingsContext.Provider>;
}
