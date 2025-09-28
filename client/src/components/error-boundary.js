import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { Button } from './ui/button';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
        this.reset = () => {
            this.setState({ hasError: false });
        };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught an error', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground", children: "Please try again." }), _jsx(Button, { onClick: this.reset, children: "Retry" })] }));
        }
        return this.props.children;
    }
}
