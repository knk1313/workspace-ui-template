import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type ToastType = "success" | "error";
type ToastItem = { id: number; message: string; type: ToastType; leaving: boolean };
type ToastContextValue = { toast: (message: string, type?: ToastType) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

// 成功/失敗の通知を1つの仕組みに集約する（alert 等の乱立をなくす）。
export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast は ToastProvider の内側で使ってください");
    return ctx;
}

// 1件のトースト。マウント時にせり上がり、leaving で退場アニメ（アンマウントは親が遅延）。
function ToastView({ item }: { item: ToastItem }) {
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
    }, []);
    const show = entered && !item.leaving;
    return (
        <div
            role="status"
            className={`pointer-events-auto flex items-center gap-2.5 rounded-surface bg-dark-surface py-3 pl-4 pr-5 text-sm text-on-dark shadow-toast transition-[transform,opacity] duration-[550ms] ease-spring ${
                show ? "translate-y-0 scale-100 opacity-100" : "translate-y-[140%] scale-90 opacity-0"
            }`}
        >
            {item.type === "error" ? (
                <XCircle className="h-4 w-4 text-on-dark-danger" />
            ) : (
                <CheckCircle2 className="h-4 w-4 text-on-dark-success" />
            )}
            {item.message}
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);
    const nextId = useRef(1);

    const toast = useCallback((message: string, type: ToastType = "success") => {
        const id = nextId.current++;
        setItems((prev) => [...prev, { id, message, type, leaving: false }]);
        // 3.5秒後に退場アニメを開始し、アニメ後に実際に取り除く。
        setTimeout(() => {
            setItems((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
            setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 600);
        }, 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {/* ダークなスナックバー（左下）。角丸・淡い影で統一。 */}
            <div className="pointer-events-none fixed bottom-5 left-5 z-[60] flex flex-col items-start gap-2">
                {items.map((t) => (
                    <ToastView key={t.id} item={t} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
