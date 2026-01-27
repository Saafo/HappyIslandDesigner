import { emitter } from './emitter';

const pencilModeStorageKey = 'pencilModeEnabled';

function readPencilModeEnabled(): boolean {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const value = localStorage.getItem(pencilModeStorageKey);
    return value === '1';
  } catch (e) {
    return false;
  }
}

export const store: {
  canvas: HTMLCanvasElement | null;
  pencilModeEnabled: boolean;
} = {
  canvas: null,
  pencilModeEnabled: readPencilModeEnabled(),
};

export function setPencilModeEnabled(enabled: boolean) {
  store.pencilModeEnabled = enabled;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(pencilModeStorageKey, enabled ? '1' : '0');
    }
  } catch (e) {
    void e;
  }
  emitter.emit('pencilModeUpdate', enabled);
}
