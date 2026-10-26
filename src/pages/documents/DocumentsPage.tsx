import { FilePlus2, FileText } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import SideDrawer from "@/components/SideDrawer";
import CreateDocumentForm from "./CreateDocumentForm";
import DocumentMobileList from "./DocumentMobileList";
import DocumentPreview from "./DocumentPreview";
import DocumentSelectionBar from "./DocumentSelectionBar";
import DocumentTable from "./DocumentTable";
import DocumentToolbar from "./DocumentToolbar";
import { useDocumentsPage } from "./useDocumentsPage";

// ドキュメント一覧。状態と操作は useDocumentsPage に集め、ここでは部品を並べるだけにする。
// md 以上は表（DocumentTable）、md 未満はカード（DocumentMobileList）で表示する。
export default function DocumentsPage() {
    const page = useDocumentsPage();
    const { visible, selection, actions } = page;

    return (
        <>
            <PageHeader
                title="ドキュメント"
                breadcrumbs={[{ label: "ホーム", href: "/" }, { label: "ドキュメント" }]}
                actions={
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted tabular-nums md:hidden">{visible.length} 件</span>
                        <Button onClick={page.openCreate}>
                            <FilePlus2 className="h-4 w-4" />
                            新規作成
                        </Button>
                    </div>
                }
            />

            <DocumentToolbar filters={page.filters} count={visible.length} />

            {visible.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={<FileText className="h-10 w-10" />}
                        title="該当するドキュメントがありません"
                        message="検索条件を変えるか、新しく作成してください。"
                    />
                </Card>
            ) : (
                <>
                    <DocumentTable docs={visible} selection={selection} actions={actions} />
                    <DocumentMobileList docs={visible} selection={selection} actions={actions} />
                </>
            )}

            <DocumentSelectionBar
                count={page.selectedVisibleIds.length}
                onDelete={() => actions.remove(page.selectedVisibleIds)}
                onClear={page.clearSelection}
            />

            {page.creating && (
                <SideDrawer title="新規ドキュメント" label="新規ドキュメント" onClose={page.closeCreate}>
                    <CreateDocumentForm onSubmit={page.create} />
                </SideDrawer>
            )}

            {page.previewing && <DocumentPreview doc={page.previewing} onClose={page.closePreview} />}
        </>
    );
}
