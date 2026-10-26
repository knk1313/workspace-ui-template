import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

// デザインシステムのガードレール。色と影は src/index.css の @theme トークンで書く。
// className に書いた文字列（通常の文字列とテンプレート文字列）を正規表現で検査する。
const DESIGN_RULES = [
    {
        // トークン以外の影（shadow-sm / shadow-xl / shadow-[…] など）
        pattern: String.raw`(^|[\s:!])shadow-(?!(control|card|panel|bar|toast|none)\b)`,
        message: "影は @theme のトークン（shadow-control / shadow-card / shadow-panel / shadow-bar / shadow-toast）を使ってください。",
    },
    {
        // Tailwind 既定のパレット色（bg-gray-100 / text-white など）
        pattern: String.raw`(^|[\s:!])(bg|text|border|ring|outline|divide|fill|stroke|from|via|to|accent|caret|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b`,
        message: "色は @theme のトークン（bg-surface / text-muted / bg-status-success-surface / text-on-dark など）を使ってください。",
    },
    {
        // 色の任意値（bg-[#fff] / text-[rgb(…)] など）
        pattern: String.raw`-\[(#|rgb|hsl|oklch)`,
        message: "色の任意値は使わず、必要なら @theme にトークンを追加してください。",
    },
];

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat["recommended-latest"]],
        languageOptions: { globals: globals.browser },
        rules: {
            "no-restricted-syntax": [
                "error",
                ...DESIGN_RULES.flatMap(({ pattern, message }) => [
                    { selector: `Literal[value=/${pattern}/]`, message },
                    { selector: `TemplateElement[value.cooked=/${pattern}/]`, message },
                ]),
            ],
        },
    },
]);
