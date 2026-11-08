// src/shared/types/utilities/omit-replace.utility.shared.type.ts

export type OmitAndReplace<T, R extends object> = Omit<T, keyof R> & R;
