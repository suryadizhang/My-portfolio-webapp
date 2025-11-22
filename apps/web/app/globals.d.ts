// CSS module declarations for TypeScript

// For CSS modules (with default export)
declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.sass' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.less' {
  const content: { [className: string]: string };
  export default content;
}

// For global CSS imports (side effects only)
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';