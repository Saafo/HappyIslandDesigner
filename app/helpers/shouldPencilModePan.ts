import { isStylusEvent } from './isStylusEvent';

export function shouldPencilModePan(nativeEvent: any, pencilModeEnabled: boolean): boolean {
  if (!pencilModeEnabled) {
    return false;
  }
  if (isStylusEvent(nativeEvent)) {
    return false;
  }
  if (nativeEvent?.pointerType) {
    if (nativeEvent.pointerType === 'touch') {
      return nativeEvent.isPrimary !== false;
    }
    return nativeEvent.pointerType === 'mouse';
  }
  const touches = nativeEvent?.touches;
  if (touches && typeof touches.length === 'number') {
    return touches.length === 1;
  }
  return true;
}
