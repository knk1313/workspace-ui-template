import { useState } from "react";
import { ListFilter, Search } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import type { Status } from "@/components/StatusBadge";
import type { DocumentType } from "@/data/sample";
import { STATUS_OPTIONS, TYPE_OPTIONS } from "./options";
import type { DocumentFilters } from "./useDocumentsPage";

// 検索 + フィルターチップ。モバイルではフィルターをボタンで開閉し、md 以上では常に表示する。
export default function DocumentToolbar({ filters, count }: { filters: DocumentFilters; count: number }) {
    const [showFilters, setShowFilters] = useState(false);
    const { query, setQuery, type, setType, status, setStatus, activeCount } = filters;

    return (
        <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 md:w-72 md:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="タイトル・作成者で検索"
                    aria-label="検索"
                    className="h-10 pl-9 md:h-9"
                />
            </div>
            <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                aria-label={activeCount > 0 ? `フィルター（${activeCount} 件適用中）` : "フィルター"}
                aria-expanded={showFilters}
                aria-controls="document-filters"
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-control-border text-ink transition-colors hover:bg-surface-2 md:hidden ${
                    showFilters ? "bg-surface-2" : ""
                }`}
            >
                <ListFilter className="h-5 w-5" />
                {activeCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-medium text-on-brand tabular-nums">
                        {activeCount}
                    </span>
                )}
            </button>
            <div id="document-filters" className={`${showFilters ? "flex" : "hidden"} w-full flex-wrap items-center gap-2 md:flex md:w-auto`}>
                <Select value={type} active={type !== ""} onChange={(e) => setType(e.target.value as DocumentType | "")} aria-label="種類">
                    <option value="">種類: すべて</option>
                    {TYPE_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </Select>
                <Select value={status} active={status !== ""} onChange={(e) => setStatus(e.target.value as Status | "")} aria-label="状態">
                    <option value="">状態: すべて</option>
                    {STATUS_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </Select>
                {filters.hasAny && (
                    <Button variant="text" size="sm" onClick={filters.clear}>
                        クリア
                    </Button>
                )}
            </div>
            <span className="ml-auto hidden text-sm text-muted tabular-nums md:inline">{count} 件</span>
        </div>
    );
}
