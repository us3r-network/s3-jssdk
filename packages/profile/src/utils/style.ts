export const createClassNameByPrefix = (className: string, prefix?: string) =>
  `${prefix ?? "us3r"}-${className}`;
