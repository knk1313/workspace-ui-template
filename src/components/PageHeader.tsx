import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

type Props = {
    title: string;
    /** タイトル下の補足説明（任意）。 */
    description?: string;
    breadcrumbs?: Crumb[];
    // タイトル行の右側に置くアクション（作成ボタンなど）。
    actions?: ReactNode;
};

export default function PageHeader({ title, description, breadcrumbs = [], actions }: Props) {
    return (
        <div className="mb-6">
            {breadcrumbs.length > 0 && (
                <nav className="mb-2 flex items-center gap-1 text-sm text-faint">
                    {breadcrumbs.map((crumb, i) => (
                        <span key={crumb.label} className="flex items-center gap-1">
                            {crumb.href ? (
                                <Link to={crumb.href} className="hover:text-muted">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-muted">{crumb.label}</span>
                            )}
                            {i < breadcrumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
                        </span>
                    ))}
                </nav>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-[22px] font-normal text-ink">{title}</h1>
                    {description && <p className="mt-1 text-sm text-muted">{description}</p>}
                </div>
                {actions}
            </div>
        </div>
    );
}
