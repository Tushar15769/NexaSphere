import type { CSSProperties } from 'react';

export type CssVars = CSSProperties & Record<`--${string}`, string | number>;

export type VoidCallback = () => void;

export type Setter<T> = (value: T) => void;

export type JsonRecord = Record<string, unknown>;

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function asHtmlElement(target: EventTarget | null): HTMLElement | null {
  return target instanceof HTMLElement ? target : null;
}
