import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import Modal from "./Modal";

function Harness() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                開く
            </button>
            {open && (
                <Modal label="テスト" onClose={() => setOpen(false)}>
                    <div>
                        <input aria-label="名前" />
                        <select aria-label="区分">
                            <option>A</option>
                        </select>
                        <textarea aria-label="備考" />
                    </div>
                </Modal>
            )}
        </>
    );
}

async function openModal() {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "開く" }));
    return user;
}

describe("Modal（useModalBehavior）", () => {
    it("開くと閉じるボタンにフォーカスし、Tab は中で巡回する（select と textarea を含む）", async () => {
        const user = await openModal();
        expect(screen.getByRole("button", { name: "閉じる" })).toHaveFocus();

        await user.tab();
        expect(screen.getByLabelText("名前")).toHaveFocus();
        await user.tab();
        expect(screen.getByLabelText("区分")).toHaveFocus();
        await user.tab();
        expect(screen.getByLabelText("備考")).toHaveFocus();
        await user.tab();
        expect(screen.getByRole("button", { name: "閉じる" })).toHaveFocus();
        await user.tab({ shift: true });
        expect(screen.getByLabelText("備考")).toHaveFocus();
    });

    it("Esc で閉じ、開く前の要素へフォーカスを戻す", async () => {
        const user = await openModal();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "開く" })).toHaveFocus();
    });

    it("中身のクリックでは閉じず、暗幕のクリックで閉じる", async () => {
        const user = await openModal();
        await user.click(screen.getByLabelText("名前"));
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        await user.click(screen.getByRole("dialog"));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
