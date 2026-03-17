import { useCallback } from 'react';
import { useExperience } from '@/components/experience/ExperienceProvider';

export function useCursorHover() {
  const { setCursorMode } = useExperience();

  const hoverProps = {
    onPointerEnter: useCallback(() => setCursorMode('hover'), [setCursorMode]),
    onPointerLeave: useCallback(() => setCursorMode('default'), [setCursorMode]),
  };

  return hoverProps;
}
