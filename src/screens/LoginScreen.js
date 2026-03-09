import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import ButtonPrimary from '../components/ButtonPrimary';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../styles/colors';
import { textStyles, typography } from '../styles/typography';

/**
 * Login Screen
 * Handles user authentication with email/password
 * Accessible form with large inputs and high contrast
 */
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  
  const { login, register, loading, error } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (isRegistering && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      if (isRegistering) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text 
            style={[textStyles.heading1, styles.title]}
            accessibilityRole="header"
            allowFontScaling={true}       // scale with user settings
            includeFontPadding={false}    // fixes Android cutoff
          >
            Robot Navigator
          </Text>
        </View>

        <View style={styles.form}>
          {isRegistering && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.gray300}
                autoComplete="name"
                textContentType="name"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="student@school.edu"
              placeholderTextColor={colors.gray300}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.gray300}
              secureTextEntry
              autoComplete={isRegistering ? "new-password" : "password"}
              textContentType={isRegistering ? "newPassword" : "password"}
            />
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <ButtonPrimary
            title={isRegistering ? 'Create Account' : 'Sign In'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />

          <ButtonPrimary
            title={isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
            onPress={() => setIsRegistering(!isRegistering)}
            variant="secondary"
            disabled={loading}
            style={styles.switchButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Accessibility assistance available
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center'
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
    flexShrink: 0, // prevent shrinking on mobile
    overflow: 'visible'
  },
  title: {
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    includeFontPadding: false,
    lineHeight: 54 // adjust to match heading font size\
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray800,
    marginBottom: 8
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray300,
    borderRadius: 12,
    padding: 16,
    fontSize: typography.sizes.md,
    color: colors.gray900,
    minHeight: 56
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 12
  },
  switchButton: {
    marginTop: 8
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: typography.weights.medium
  },
  footer: {
    marginTop: 32,
    alignItems: 'center'
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600
  }
});

export default LoginScreen;
