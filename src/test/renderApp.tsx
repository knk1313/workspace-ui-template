import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";

// 指定した URL でアプリ全体を描画する。操作には返り値の user を使う。
export function renderApp(path: string) {
    window.history.pushState({}, "", path);
    const user = userEvent.setup();
    const result = render(<App />);
    return { user, ...result };
}
