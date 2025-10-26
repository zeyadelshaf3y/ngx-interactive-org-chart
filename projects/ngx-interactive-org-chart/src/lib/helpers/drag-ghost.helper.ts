/**
 * Essential CSS properties to copy for drag ghost elements.
 */
const GHOST_ELEMENT_STYLES = [
  'background',
  'background-color',
  'background-image',
  'background-size',
  'background-position',
  'background-repeat',
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'text-align',
  'border',
  'border-radius',
  'border-color',
  'border-width',
  'border-style',
  'padding',
  'box-sizing',
  'display',
  'flex-direction',
  'align-items',
  'justify-content',
  'gap',
  'outline',
  'outline-color',
  'outline-width',
];

/**
 * Creates a cloned node element with copied styles for drag preview.
 * This removes interactive elements and copies essential visual styles.
 *
 * @param nodeElement - The original node element to clone
 * @returns A cloned element with copied styles
 */
export function cloneNodeWithStyles(nodeElement: HTMLElement): HTMLElement {
  // Clone the node deeply
  const clone = nodeElement.cloneNode(true) as HTMLElement;

  // Remove ID and draggable to avoid conflicts
  clone.removeAttribute('id');
  clone.removeAttribute('draggable');

  // Remove interactive elements
  const collapseBtn = clone.querySelector('.collapse-btn');
  if (collapseBtn) collapseBtn.remove();

  const dragHandle = clone.querySelector('.drag-handle');
  if (dragHandle) dragHandle.remove();

  // Get computed styles from original
  const computed = window.getComputedStyle(nodeElement);

  // Apply essential visual styles to clone
  GHOST_ELEMENT_STYLES.forEach(prop => {
    const value = computed.getPropertyValue(prop);
    if (value) {
      clone.style.setProperty(prop, value, 'important');
    }
  });

  // Apply styles to nested elements
  const sourceChildren = nodeElement.querySelectorAll('*');
  const cloneChildren = clone.querySelectorAll('*');

  sourceChildren.forEach((sourceChild, index) => {
    if (cloneChildren[index]) {
      const childComputed = window.getComputedStyle(sourceChild);
      const cloneChild = cloneChildren[index] as HTMLElement;

      GHOST_ELEMENT_STYLES.forEach(prop => {
        const value = childComputed.getPropertyValue(prop);
        if (value) {
          cloneChild.style.setProperty(prop, value, 'important');
        }
      });
    }
  });

  return clone;
}

/**
 * Configuration for creating a touch drag ghost element.
 */
export interface TouchDragGhostConfig {
  readonly nodeElement: HTMLElement;
  readonly currentScale: number;
  readonly touchX: number;
  readonly touchY: number;
}

/**
 * Result of creating a touch drag ghost element.
 */
export interface TouchDragGhostResult {
  readonly wrapper: HTMLElement;
  readonly scaledWidth: number;
  readonly scaledHeight: number;
}

/**
 * Creates a ghost element to follow the touch during drag.
 * The ghost element is wrapped in a positioned container and scaled to match the current zoom level.
 *
 * @param config - Configuration for creating the ghost element
 * @returns The wrapper element and scaled dimensions
 */
export function createTouchDragGhost(
  config: TouchDragGhostConfig
): TouchDragGhostResult {
  const { nodeElement, currentScale, touchX, touchY } = config;

  // Get the unscaled dimensions
  const unscaledWidth = nodeElement.offsetWidth;
  const unscaledHeight = nodeElement.offsetHeight;

  // Clone the node with styles using shared helper
  const ghost = cloneNodeWithStyles(nodeElement);

  // Calculate the actual scaled dimensions for positioning
  const scaleFactor = currentScale * 1.05;
  const scaledWidth = unscaledWidth * scaleFactor;
  const scaledHeight = unscaledHeight * scaleFactor;

  // Create wrapper for positioning
  const wrapper = document.createElement('div');
  wrapper.className = 'touch-drag-ghost-wrapper';
  wrapper.style.position = 'fixed';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.zIndex = '10000';
  // Position wrapper so the scaled ghost is centered on the touch point
  wrapper.style.left = touchX - scaledWidth / 2 + 'px';
  wrapper.style.top = touchY - scaledHeight / 2 + 'px';

  // Set ghost to unscaled dimensions, then apply the zoom scale via transform
  ghost.style.setProperty('position', 'relative', 'important');
  ghost.style.setProperty('width', unscaledWidth + 'px', 'important');
  ghost.style.setProperty('height', unscaledHeight + 'px', 'important');
  ghost.style.setProperty('margin', '0', 'important');
  ghost.style.setProperty('opacity', '0.9', 'important');
  ghost.style.setProperty('transform-origin', 'top left', 'important');
  // Apply the current zoom scale to match the visible node, then apply slight scale-up for drag effect
  ghost.style.setProperty('transform', `scale(${scaleFactor})`, 'important');
  ghost.style.setProperty(
    'box-shadow',
    '0 15px 40px rgba(0, 0, 0, 0.4)',
    'important'
  );
  ghost.style.setProperty('cursor', 'grabbing', 'important');

  wrapper.appendChild(ghost);
  document.body.appendChild(wrapper);

  return {
    wrapper,
    scaledWidth,
    scaledHeight,
  };
}

/**
 * Updates the position of a touch drag ghost element wrapper.
 *
 * @param wrapper - The ghost wrapper element to reposition
 * @param x - The new x coordinate
 * @param y - The new y coordinate
 * @param scaledWidth - The scaled width of the ghost element
 * @param scaledHeight - The scaled height of the ghost element
 */
export function updateTouchGhostPosition(
  wrapper: HTMLElement,
  x: number,
  y: number,
  scaledWidth: number,
  scaledHeight: number
): void {
  wrapper.style.left = x - scaledWidth / 2 + 'px';
  wrapper.style.top = y - scaledHeight / 2 + 'px';
}
