// shared-types/shared-types-utils/replace.shared.types.ts

export type Replace<T, R> = Omit<T, keyof R> & R;

export type ReplaceAndOmit<T, R, K extends keyof T> = Replace<Omit<T, K>, R>;
