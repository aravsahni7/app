import { useState, useEffect, useCallback } from 'react';
import { subscribeToRobot, callRobot, cancelRobotCall } from '../firebase/services';

/**
 * Custom Hook for Robot Operations
 * Manages real-time robot status and call requests
 */
export const useRobot = () => {
  const [robotData, setRobotData] = useState({
    status: 'available',
    location: { x: 0, y: 0 },
    eta: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to real-time robot updates
    const unsubscribe = subscribeToRobot((data) => {
      setRobotData(data);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Request robot to come to location
   */
  const requestRobot = useCallback(async (userLocation) => {
    try {
      setLoading(true);
      setError(null);
      await callRobot(userLocation);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancel current robot request
   */
  const cancelRequest = useCallback(async () => {
    try {
      setLoading(true);
      await cancelRobotCall();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    robotData,
    loading,
    error,
    requestRobot,
    cancelRequest
  };
};