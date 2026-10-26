import { Link } from "react-router";

// 404 本文。AppLayout の中に表示する。
export default function NotFoundContent() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-[14vh] text-center">
            <p className="text-6xl font-normal text-hairline">404</p>
            <h1 className="text-xl font-normal text-ink">ページが見つかりません</h1>
            <p className="text-sm text-muted">お探しのページは存在しないか、移動した可能性があります。</p>
            <Link
                to="/"
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2 text-sm font-medium text-on-brand hover:bg-brand-hover"
            >
                ホームへ戻る
            </Link>
        </div>
    );
}
