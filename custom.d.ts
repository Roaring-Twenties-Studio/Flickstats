declare module "*.module.css";

declare module "*.svg" {
  const content: (props: { width: number; height: number }) => React.JSXElement;
  export default content;
}

declare module "*.jpeg" {
  const content: never;
  export default content;
}

declare module "*.jpg" {
  const content: never;
  export default content;
}

declare module "*.png" {
  const content: never;
  export default content;
}
