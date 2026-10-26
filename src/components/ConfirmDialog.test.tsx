import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { ConfirmProvider, useConfirm } from "./ConfirmDialog";

type Confirm = ReturnType<typeof useConfirm>["confirm"];

function Capture({ onReady }: { onReady: (confirm: Confirm) => void }) {
    const { confirm } = useConfirm();
    useEffect(() => onReady(confirm), [confirm, onReady]);
    return null;
}

describe("ConfirmDialog", () => {
    it("連続して呼ばれた確認を順に表示し、それぞれの結果を返す", async () => {
        const user = userEvent.setup();
        let confirm!: Confirm;
        render(
            <ConfirmProvider>
                <Capture onReady={(c) => (confirm = c)} />
            </ConfirmProvider>,
        );

        let first!: Promise<boolean>;
        let second!: Promise<boolean>;
        act(() => {
            first = confirm({ title: "一つ目" });
            second = confirm({ title: "二つ目" });
        });

        expect(screen.getByRole("dialog", { name: "一つ目" })).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "OK" }));
        await expect(first).resolves.toBe(true);

        expect(await screen.findByRole("dialog", { name: "二つ目" })).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "キャンセル" }));
        await expect(second).resolves.toBe(false);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
