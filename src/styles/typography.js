/**
 * Typography Styles
 * Large, readable fonts for accessibility
 */

export const typography = {
    // Font sizes - large for accessibility
    sizes: {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 24,
      xl: 32,
      xxl: 48,
      huge: 64
    },
    
    // Font weights
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    
    // Line heights for readability
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  };
  
  // Common text styles
  export const textStyles = {
    heading1: {
      fontSize: typography.sizes.xxl,
      fontWeight: typography.weights.bold,
      lineHeight: typography.lineHeights.tight,
      marginBottom: 16
    },
    heading2: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.semibold,
      lineHeight: typography.lineHeights.tight,
      marginBottom: 12
    },
    bodyLarge: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.normal,
      lineHeight: typography.lineHeights.relaxed
    },
    body: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.normal,
      lineHeight: typography.lineHeights.normal
    },
    label: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.medium,
      textTransform: 'uppercase',
      letterSpacing: 0.5
    },
    button: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.bold,
      letterSpacing: 0.5
    }
  };