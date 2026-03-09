import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  Platform 
} from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

/**
 * Primary Button Component
 * Large, accessible button with high contrast
 * 
 * @param {string} title - Button text
 * @param {function} onPress - Press handler
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {string} variant - 'primary', 'danger', 'success'
 * @param {object} style - Additional styles
 */
const ButtonPrimary = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  style = {} 
}) => {
  // Determine colors based on variant
  const getColors = () => {
    switch(variant) {
      case 'danger':
        return { bg: colors.danger, text: colors.white };
      case 'success':
        return { bg: colors.success, text: colors.white };
      case 'secondary':
        return { bg: colors.gray200, text: colors.gray800 };
      default:
        return { bg: colors.primary, text: colors.white };
    }
  };

  const { bg, text } = getColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint="Double tap to activate"
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.button,
        { backgroundColor: bg },
        (disabled || loading) && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={text} size="large" />
      ) : (
        <Text style={[styles.text, { color: text }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    // Web-specific hover effects
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.1s',
        ':hover': {
          transform: 'scale(1.02)'
        }
      }
    })
  },
  text: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    textAlign: 'center'
  },
  disabled: {
    opacity: 0.6
  }
});

export default ButtonPrimary;