import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography, textStyles } from '../styles/typography';

/**
 * Robot Status Card Component
 * Displays current robot status, location, and ETA
 * 
 * @param {object} robotData - Robot data from Firestore
 * @param {string} status - 'available' | 'busy' | 'coming' | 'arrived'
 * @param {number} eta - Estimated time in minutes
 * @param {object} location - Robot coordinates {x, y}
 */
const RobotStatusCard = ({ robotData }) => {
  const { status = 'available', eta = 0, location = { x: 0, y: 0 } } = robotData;

  // Get status display info
  const getStatusInfo = () => {
    switch(status) {
      case 'available':
        return {
          label: 'Robot Available',
          color: colors.statusAvailable,
          message: 'Ready to assist you'
        };
      case 'busy':
        return {
          label: 'Robot Busy',
          color: colors.statusBusy,
          message: 'Currently assisting another student'
        };
      case 'coming':
        return {
          label: 'Robot on the Way',
          color: colors.statusComing,
          message: `Arriving in approximately ${eta} minutes`
        };
      case 'arrived':
        return {
          label: 'Robot Arrived',
          color: colors.statusArrived,
          message: 'Robot is waiting at your location'
        };
      default:
        return {
          label: 'Status Unknown',
          color: colors.gray600,
          message: 'Connecting to robot...'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View 
      style={styles.container}
      accessibilityRole="summary"
      accessibilityLabel={`Robot status: ${statusInfo.label}. ${statusInfo.message}`}
    >
      <View style={[styles.statusIndicator, { backgroundColor: statusInfo.color }]} />
      
      <View style={styles.content}>
        <Text style={textStyles.heading2} accessibilityRole="header">
          {statusInfo.label}
        </Text>
        
        <Text style={[textStyles.bodyLarge, styles.message]}>
          {statusInfo.message}
        </Text>

        {(status === 'coming' || status === 'arrived') && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>X: {location.x}, Y: {location.y}</Text>
            </View>
            {eta > 0 && status === 'coming' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ETA:</Text>
                <Text style={styles.detailValue}>{eta} min</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: colors.gray200,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
    marginTop: 6
  },
  content: {
    flex: 1
  },
  message: {
    color: colors.gray600,
    marginTop: 4
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray200
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    fontWeight: typography.weights.medium
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    color: colors.gray800,
    fontWeight: typography.weights.semibold
  }
});

export default RobotStatusCard;