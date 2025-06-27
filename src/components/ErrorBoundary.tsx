import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong loading the map.</h2>;
        }
        return this.props.children;
    }
}
