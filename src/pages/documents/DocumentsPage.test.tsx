import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderApp } from "@/test/renderApp";

// jsdom では CSS が効かず、表（md 以上）とカード（md 未満）の両方が描画されるため、表の中で操作する。
const table = () => within(screen.getByRole("table"));

describe("ドキュメント画面", () => {
    it("絞り込み後の一括削除は、表示中の選択項目だけを対象にする", async () => {
        const { user } = renderApp("/documents");

        await user.click(table().getByRole("button", { name: "はじめに — ワークスペースの使い方 を選択" }));
        await user.click(table().getByRole("button", { name: "UI コンポーネント一覧 を選択" }));
        expect(screen.getByText("2 件選択中")).toBeInTheDocument();

        // ガイドで絞り込むと、仕様書（UI コンポーネント一覧）は見えなくなる。
        await user.selectOptions(screen.getByRole("combobox", { name: "種類" }), "guide");
        expect(screen.getByText("1 件選択中")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "削除" }));
        const dialog = await screen.findByRole("dialog", { name: "ドキュメントを削除しますか？" });
        await user.click(within(dialog).getByRole("button", { name: "削除" }));

        await user.selectOptions(screen.getByRole("combobox", { name: "種類" }), "");
        expect(table().queryByText("はじめに — ワークスペースの使い方")).not.toBeInTheDocument();
        expect(table().getByText("UI コンポーネント一覧")).toBeInTheDocument();
        // 見えていなかった項目の選択は残る。
        expect(screen.getByText("1 件選択中")).toBeInTheDocument();
    });

    it("作成時に入力したメモがプレビューに表示される", async () => {
        const { user } = renderApp("/documents");

        await user.click(screen.getByRole("button", { name: "新規作成" }));
        const drawer = await screen.findByRole("dialog", { name: "新規ドキュメント" });
        await user.type(within(drawer).getByLabelText(/タイトル/), "メモ付きの文書");
        await user.type(within(drawer).getByLabelText("メモ"), "プレビューに出る本文");
        await user.click(within(drawer).getByRole("button", { name: "作成" }));

        await user.click(await table().findByRole("button", { name: "メモ付きの文書" }));
        const preview = await screen.findByRole("dialog", { name: "メモ付きの文書" });
        expect(within(preview).getByText("プレビューに出る本文")).toBeInTheDocument();
    });
});
