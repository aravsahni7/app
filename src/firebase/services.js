import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    onSnapshot, 
    serverTimestamp,
    updateDoc 
  } from 'firebase/firestore';
  import { auth, db } from './config';
  
  /**
   * Robot Service Functions
   * Handles all Firestore interactions for robot operations
   */
  
  const ROBOT_DOC = doc(db, 'robots', 'main');
  const CALL_REQUESTS_COLLECTION = collection(db, 'callRequests');
  
  /**
   * Subscribe to robot status and location updates
   * @param {function} callback - Function to call with robot data
   * @returns {function} Unsubscribe function
   */
  export const subscribeToRobot = (callback) => {
    return onSnapshot(ROBOT_DOC, (docSnapshot) => {
      if (docSnapshot.exists()) {
        callback({ id: docSnapshot.id, ...docSnapshot.data() });
      } else {
        // Initialize robot document if it doesn't exist
        setDoc(ROBOT_DOC, {
          status: 'available',
          location: { x: 0, y: 0 },
          eta: 0,
          updatedAt: serverTimestamp()
        });
        callback({ status: 'available', location: { x: 0, y: 0 }, eta: 0 });
      }
    }, (error) => {
      console.error('Error subscribing to robot:', error);
    });
  };
  
  /**
   * Call the robot to user's location
   * @param {object} userLocation - Object with x and y coordinates
   * @returns {Promise<void>}
   */
  export const callRobot = async (userLocation) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
  
    const requestRef = doc(db, 'callRequests', userId);
    
    await setDoc(requestRef, {
      userId: userId,
      timestamp: serverTimestamp(),
      location: userLocation,
      status: 'pending',
      userEmail: auth.currentUser.email
    });
  
    // Update robot status to indicate new request
    await updateDoc(ROBOT_DOC, {
      targetUserId: userId,
      status: 'coming',
      updatedAt: serverTimestamp()
    });
  };
  
  /**
   * Cancel robot call
   * @returns {Promise<void>}
   */
  export const cancelRobotCall = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
  
    const requestRef = doc(db, 'callRequests', userId);
    await updateDoc(requestRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp()
    });
  
    // Reset robot status
    await updateDoc(ROBOT_DOC, {
      status: 'available',
      targetUserId: null,
      updatedAt: serverTimestamp()
    });
  };
  
  /**
   * Get user profile data
   * @param {string} userId 
   * @returns {Promise<object>}
   */
  export const getUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  };
  
  /**
   * Create or update user profile
   * @param {string} userId 
   * @param {object} data 
   */
  export const updateUserProfile = async (userId, data) => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  };