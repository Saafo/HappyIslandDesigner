export function isStylusEvent(nativeEvent: any): boolean {
  const pointerType = nativeEvent?.pointerType;
  if (pointerType) {
    return pointerType === 'pen';
  }

  const touches = nativeEvent?.touches || nativeEvent?.changedTouches;
  if (touches && typeof touches.length === 'number' && touches.length > 0) {
    const touchType = touches[0]?.touchType;
    return touchType === 'stylus';
  }

  return false;
}
