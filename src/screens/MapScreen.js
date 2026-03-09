import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  Platform 
} from 'react-native';
import { useRobot } from '../hooks/useRobot';
import { colors } from '../styles/colors';
import { typography, textStyles } from '../styles/typography';

/**
 * Map Screen
 * Displays school map with robot and user positions
 * Cross-platform: Uses web-compatible placeholder for demo
 * 
 * Note: For production, integrate react-native-maps or custom SVG map
 */
const MapScreen = () => {
  const { robotData } = useRobot();
  const { location: robotLocation, status } = robotData;

  // Mock school map dimensions (in arbitrary units)
  const MAP_WIDTH = 400;
  const MAP_HEIGHT = 300;

  // Scale positions to screen coordinates
  const scaleX = (x) => (x / 200) * MAP_WIDTH;
  const scaleY = (y) => (y / 200) * MAP_HEIGHT;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={textStyles.heading1}>School Map</Text>
        <Text style={textStyles.body}>Live robot tracking</Text>
      </View>

      {/* Map Container */}
      <View style={styles.mapWrapper}>
        <View style={[styles.map, { width: MAP_WIDTH, height: MAP_HEIGHT }]}>
          {/* Grid lines for visual reference */}
          <GridLines />
          
          {/* User Location Marker */}
          <View 
            style={[
              styles.marker, 
              styles.userMarker,
              { 
                left: scaleX(100) - 15, 
                top: scaleY(200) - 30 
              }
            ]}
            accessibilityLabel="Your location"
            accessibilityRole="image"
          >
            <View style={styles.userDot} />
            <View style={styles.markerLabel}>
              <Text style={styles.markerText}>You</Text>
            </View>
          </View>

          {/* Robot Location Marker */}
          <View 
            style={[
              styles.marker, 
              styles.robotMarker,
              { 
                left: scaleX(robotLocation.x) - 15, 
                top: scaleY(robotLocation.y) - 30 
              }
            ]}
            accessibilityLabel={`Robot location. Status: ${status}`}
            accessibilityRole="image"
          >
            <View style={[
              styles.robotDot,
              status === 'coming' && styles.robotDotActive
            ]}>
              <Text style={styles.robotIcon}>🤖</Text>
            </View>
            <View style={styles.markerLabel}>
              <Text style={styles.markerText}>Robot</Text>
            </View>
          </View>

          {/* Buildings/Obstacles */}
          <Building x={50} y={50} width={80} height={60} name="Library" />
          <Building x={150} y={120} width={100} height={80} name="Cafeteria" />
          <Building x={250} y={40} width={70} height={70} name="Gym" />
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <LegendItem color={colors.primary} label="Robot" />
          <LegendItem color={colors.success} label="Your Location" />
          <LegendItem color={colors.gray400} label="Buildings" />
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Robot Position: X: {robotLocation.x}, Y: {robotLocation.y}
        </Text>
        <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          {status?.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

// Grid Lines Component
const GridLines = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <View 
        key={`h-${i}`} 
        style={[styles.gridLine, styles.gridLineHorizontal, { top: (i + 1) * 60 }]} 
      />
    ))}
    {[...Array(6)].map((_, i) => (
      <View 
        key={`v-${i}`} 
        style={[styles.gridLine, styles.gridLineVertical, { left: (i + 1) * 66 }]} 
      />
    ))}
  </>
);

// Building Component
const Building = ({ x, y, width, height, name }) => (
  <View 
    style={[
      styles.building,
      { 
        left: (x / 200) * 400, 
        top: (y / 200) * 300,
        width: (width / 200) * 400,
        height: (height / 200) * 300
      }
    ]}
    accessibilityLabel={`Building: ${name}`}
  >
    <Text style={styles.buildingLabel}>{name}</Text>
  </View>
);

// Legend Item Component
const LegendItem = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

// Helper to get color based on status
const getStatusColor = (status) => {
  switch(status) {
    case 'available': return colors.statusAvailable;
    case 'busy': return colors.statusBusy;
    case 'coming': return colors.statusComing;
    case 'arrived': return colors.statusArrived;
    default: return colors.gray400;
  }
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
    padding: 20
  },
  header: {
    marginBottom: 20
  },
  mapWrapper: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.gray200
  },
  map: {
    backgroundColor: '#f0fdf4', // Light green for school ground
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.gray300
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    height: 1
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    width: 1
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10
  },
  userMarker: {
    zIndex: 5
  },
  robotMarker: {
    zIndex: 10
  },
  userDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 4
  },
  robotDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    elevation: 6
  },
  robotDotActive: {
    backgroundColor: colors.statusComing,
    transform: [{ scale: 1.1 }]
  },
  robotIcon: {
    fontSize: 18
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  markerText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.bold
  },
  building: {
    position: 'absolute',
    backgroundColor: colors.gray300,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray400,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buildingLabel: {
    fontSize: 10,
    color: colors.gray600,
    fontWeight: typography.weights.medium,
    textAlign: 'center'
  },
  legend: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 20
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6
  },
  legendText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 2,
    borderColor: colors.gray200
  },
  statusText: {
    fontSize: typography.sizes.sm,
    color: colors.gray700,
    fontWeight: typography.weights.medium,
    fontFamily: Platform.select({ web: 'monospace', default: 'monospace' })
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    overflow: 'hidden'
  }
});

export default MapScreen;