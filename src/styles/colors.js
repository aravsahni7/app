/**
 * Color Palette
 * High contrast colors for accessibility
 */

export const colors = {
    // Primary colors
    primary: '#2563EB',      // Blue
    primaryDark: '#1D4ED8',
    primaryLight: '#93C5FD',
    
    // Status colors
    success: '#059669',      // Green
    warning: '#D97706',      // Orange
    danger: '#DC2626',       // Red
    info: '#0891B2',         // Cyan
    
    // Neutral colors
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray600: '#4B5563',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
    
    // Robot status specific
    statusAvailable: '#10B981',
    statusBusy: '#EF4444',
    statusComing: '#F59E0B',
    statusArrived: '#3B82F6',
    
    // Accessibility
    focus: '#F59E0B',        // High visibility focus ring
    highContrastBorder: '#000000'
  };
  
  // High contrast mode colors
  export const highContrastColors = {
    ...colors,
    primary: '#0000FF',
    background: '#FFFFFF',
    text: '#000000',
    border: '#000000',
    buttonBg: '#000000',
    buttonText: '#FFFFFF'
  };