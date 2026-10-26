import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import Button from "./Button";
import { useModalBehavior } from "@/hooks/useModalBehavior";

// window.confirm の置き換え。アプリの世界観（surface カード＋トークン色）で
// 破壊操作の確認を出す。await confirm({...}) が真偽値を返すので呼び出し側は
// `if (!(await confirm({...}))) return;` と window.confirm 感覚で使える。
export type ConfirmOptions = {
    title: string;
    /** 補足説明（任意）。取り消せない旨などを書く。 */
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** 削除・破棄など取り消せない操作。確定ボタンを塗り赤にする。 */
    danger?: boolean;
};

type ConfirmContextValue = { confirm: (opts: ConfirmOptions) => Promise<boolean> };

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm(): ConfirmContextValue {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm は ConfirmProvider の内側で使ってください");
    return ctx;
}

type Request = ConfirmOptions & { id: number; resolve: (ok: boolean) => void };

// 表示中に confirm() が呼ばれたら待ち行列に積み、前の確認が閉じてから順に表示する。
// 上書きすると前の呼び出しの Promise が解決されないまま残るため。
export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [queue, setQueue] = useState<Request[]>([]);
    const nextId = useRef(1);

    const confirm = useCallback((opts: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            const id = nextId.current++;
            setQueue((q) => [...q, { ...opts, id, resolve }]);
        });
    }, []);

    const current = queue[0];

    function close(ok: boolean) {
        if (!current) return;
        current.resolve(ok);
        setQueue((q) => q.filter((r) => r.id !== current.id));
    }

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {/* key で 1 件ごとに作り直し、初期フォーカスとフォーカス復帰を毎回かける。 */}
            {current && <ConfirmView key={current.id} request={current} onClose={close} />}
        </ConfirmContext.Provider>
    );
}

function ConfirmView({ request, onClose }: { request: Request; onClose: (ok: boolean) => void }) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const confirmBtnRef = useRef<HTMLButtonElement>(null);
    useModalBehavior({ onClose: () => onClose(false), containerRef: dialogRef, initialFocusRef: confirmBtnRef });

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-scrim/40 p-4"
            onClick={(e) => {
                // 暗幕そのものを押したときだけ閉じる（ダイアログ内のクリックでは閉じない）。
                if (e.target === e.currentTarget) onClose(false);
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={request.title}
                className="w-full max-w-sm rounded-surface bg-surface p-6 shadow-panel"
            >
                <h2 className="text-base font-semibold text-ink">{request.title}</h2>
                {request.message && <p className="mt-2 text-sm leading-relaxed text-muted">{request.message}</p>}
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="text" size="sm" onClick={() => onClose(false)}>
                        {request.cancelLabel ?? "キャンセル"}
                    </Button>
                    <Button
                        ref={confirmBtnRef}
                        variant={request.danger ? "danger-filled" : "primary"}
                        size="sm"
                        onClick={() => onClose(true)}
                    >
                        {request.confirmLabel ?? "OK"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
