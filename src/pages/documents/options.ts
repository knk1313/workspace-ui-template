import { STATUS_LABELS, type Status } from "@/components/StatusBadge";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@/data/sample";

// フィルターと作成フォームの選択肢。
export const TYPE_OPTIONS = Object.entries(DOCUMENT_TYPE_LABELS) as [DocumentType, string][];
export const STATUS_OPTIONS = Object.entries(STATUS_LABELS) as [Status, string][];
