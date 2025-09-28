import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './ui/button';
export function EmptyState({ title, description, actionLabel, onAction }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center", children: [_jsx("h2", { className: "text-lg font-semibold", children: title }), description ? _jsx("p", { className: "text-sm text-muted-foreground", children: description }) : null, actionLabel && onAction ? (_jsx(Button, { onClick: onAction, variant: "default", children: actionLabel })) : null] }));
}
