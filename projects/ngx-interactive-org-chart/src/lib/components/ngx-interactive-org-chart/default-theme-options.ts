import { NgxInteractiveOrgChartTheme } from '../../models';

export const DEFAULT_THEME_OPTIONS: NgxInteractiveOrgChartTheme = {
  node: {
    background: '#ffffff',
    color: '#4a4a4a',
    activeOutlineColor: '#3b82f6',
    outlineWidth: '2px',
    shadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    outlineColor: '#d1d5db',
    highlightShadowColor: 'rgba(121, 59, 246, 0)',
    padding: '12px 16px',
    borderRadius: '8px',
    containerSpacing: '20px',
    activeColor: '#3b82f6',
    maxWidth: 'auto',
    minWidth: 'auto',
    maxHeight: 'auto',
    minHeight: 'auto',
  },
  connector: {
    color: '#d1d5db',
    activeColor: '#3b82f6',
    borderRadius: '10px',
    width: '1.5px',
  },
  collapseButton: {
    size: '20px',
    borderColor: '#d1d5db',
    borderRadius: '0.25rem',
    color: '#4a4a4a',
    background: '#ffffff',
    hoverColor: '#3b82f6',
    hoverBackground: '#f3f4f6',
    hoverShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    hoverTransformScale: '1.05',
    focusOutline: '2px solid #3b82f6',
    countFontSize: '0.75rem',
  },
  container: {
    background: 'transparent',
    border: 'none',
  },
};
