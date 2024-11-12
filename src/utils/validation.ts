export const emailRules = [
  (v: string | null) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v || "") ||
    "E-mail must be valid",
];
