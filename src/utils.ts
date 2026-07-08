export const clsx = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const capitalize = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

