import type { JSX } from "react";
/// <reference types="@mdx-js/loader" />

declare module '*.mdx' {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
