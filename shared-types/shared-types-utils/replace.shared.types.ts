// shared-types/shared-types-utils/replace.shared.types.ts

export type Replace<T, R> = Omit<T, keyof R> & R;
