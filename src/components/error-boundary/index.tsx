import { Component, ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children?: ReactNode;
}

export class ErrorBoundary extends Component<Props> {
  state = { error: null };

  static defaultProps: Props = {
    fallback: [],
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
