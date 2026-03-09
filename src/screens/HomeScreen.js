import { Image } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRobot } from '../hooks/useRobot';
import RobotStatusCard from '../components/RobotStatusCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
//  ROBOT CHARACTER — styled after the reference: big round helmet, cyan eyes,
//  silver body, chunky fists, two antennas with pink tips
// ─────────────────────────────────────────────────────────────────────────────
const ROBOT_W = 110; // total bounding width used for peek offset

const RobotCharacter = ({ isRunning = false, scale = 1, facingLeft = false }) => {
  const legL  = useRef(new Animated.Value(0)).current;
  const legR  = useRef(new Animated.Value(0)).current;
  const armL  = useRef(new Animated.Value(0)).current;
  const armR  = useRef(new Animated.Value(0)).current;
  const bob   = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;

  // Running cycle
  useEffect(() => {
    let loop;
    if (isRunning) {
      const t = (a, v, d) =>
        Animated.timing(a, { toValue: v, duration: d, useNativeDriver: true, easing: Easing.inOut(Easing.quad) });
      loop = Animated.loop(Animated.parallel([
        Animated.sequence([t(legL,  30, 140), t(legL, -30, 140)]),
        Animated.sequence([t(legR, -30, 140), t(legR,  30, 140)]),
        Animated.sequence([t(armL, -24, 140), t(armL,  24, 140)]),
        Animated.sequence([t(armR,  24, 140), t(armR, -24, 140)]),
        Animated.sequence([t(bob, -5, 70), t(bob, 0, 70), t(bob, -5, 70), t(bob, 0, 70)]),
      ]));
      loop.start();
    } else {
      [legL, legR, armL, armR, bob].forEach(a =>
        Animated.spring(a, { toValue: 0, friction: 7, useNativeDriver: true }).start()
      );
    }
    return () => loop?.stop();
  }, [isRunning]);

  // Blink
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.delay(3000),
      Animated.timing(blink, { toValue: 0.05, duration: 70, useNativeDriver: true }),
      Animated.timing(blink, { toValue: 1,    duration: 70, useNativeDriver: true }),
      Animated.delay(180),
      Animated.timing(blink, { toValue: 0.05, duration: 70, useNativeDriver: true }),
      Animated.timing(blink, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const legLRot = legL.interpolate({ inputRange: [-35, 35], outputRange: ['-35deg', '35deg'] });
  const legRRot = legR.interpolate({ inputRange: [-35, 35], outputRange: ['-35deg', '35deg'] });
  const armLRot = armL.interpolate({ inputRange: [-30, 30], outputRange: ['-30deg', '30deg'] });
  const armRRot = armR.interpolate({ inputRange: [-30, 30], outputRange: ['-30deg', '30deg'] });

  return (
    <View style={[rc.root, { transform: [{ scale }, { scaleX: facingLeft ? -1 : 1 }] }]}>
      <Animated.View style={[rc.inner, { transform: [{ translateY: bob }] }]}>

        {/* ── Two antennas ── */}
        <View style={rc.antennaRow}>
          <View style={rc.antennaWrap}>
            <View style={rc.antennaTip} />
            <View style={rc.antennaShaft} />
          </View>
          <View style={{ width: 46 }} />
          <View style={rc.antennaWrap}>
            <View style={rc.antennaTip} />
            <View style={rc.antennaShaft} />
          </View>
        </View>

        {/* ── Helmet (big round outer ring) ── */}
        <View style={rc.helmet}>
          {/* visor */}
          <View style={rc.visor}>
            {/* glare dots */}
            <View style={rc.glare1} />
            <View style={rc.glare2} />
            {/* eyes */}
            <View style={rc.eyeRow}>
              <Animated.View style={[rc.eye, { transform: [{ scaleY: blink }] }]} />
              <Animated.View style={[rc.eye, { transform: [{ scaleY: blink }] }]} />
            </View>
            {/* small mouth bar */}
            <View style={rc.mouthBar} />
          </View>
          {/* chin vent strips */}
          <View style={rc.ventRow}>
            {[0,1,2,3].map(i => <View key={i} style={rc.vent} />)}
          </View>
        </View>

        {/* ── Neck connector ── */}
        <View style={rc.neck} />

        {/* ── Torso row: fist | body | fist ── */}
        <View style={rc.torsoRow}>
          {/* Left arm + fist */}
          <Animated.View style={[rc.armWrap, { transform: [{ rotate: armLRot }] }]}>
            <View style={rc.armShaft} />
            <View style={rc.fist} />
          </Animated.View>

          {/* Body */}
          <View style={rc.body}>
            {/* shoulder plate line */}
            <View style={rc.shoulderLine} />
            {/* chest circle */}
            <View style={rc.chestRing}>
              <View style={rc.chestCore} />
            </View>
            {/* accent dots */}
            <View style={rc.accentRow}>
              <View style={[rc.accentDot, { backgroundColor: '#FF8A80' }]} />
              <View style={[rc.accentDot, { backgroundColor: '#FF8A80' }]} />
            </View>
          </View>

          {/* Right arm + fist */}
          <Animated.View style={[rc.armWrap, { transform: [{ rotate: armRRot }] }]}>
            <View style={rc.armShaft} />
            <View style={rc.fist} />
          </Animated.View>
        </View>

        {/* ── Waist panel ── */}
        <View style={rc.waist} />

        {/* ── Legs ── */}
        <View style={rc.legRow}>
          <Animated.View style={[rc.legWrap, { transform: [{ rotate: legLRot }] }]}>
            <View style={rc.legShaft} />
            <View style={rc.boot} />
          </Animated.View>
          <Animated.View style={[rc.legWrap, { transform: [{ rotate: legRRot }] }]}>
            <View style={rc.legShaft} />
            <View style={rc.boot} />
          </Animated.View>
        </View>

      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  INTRO SEQUENCE
// ─────────────────────────────────────────────────────────────────────────────
const RobotIntro = ({ onComplete }) => {
  const robotX    = useRef(new Animated.Value(SCREEN_WIDTH + 40)).current;
  const robotY    = useRef(new Animated.Value(0)).current;
  const bubbleOp  = useRef(new Animated.Value(0)).current;
  const bubbleSc  = useRef(new Animated.Value(0.4)).current;
  const overlayOp = useRef(new Animated.Value(1)).current;
  const [running, setRunning] = useState(true);

  useEffect(() => {
    // Sprint in
    Animated.timing(robotX, {
      toValue: 0, duration: 680,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start(() => {
      // Skid stop
      setRunning(false);
      Animated.sequence([
        Animated.timing(robotX, { toValue: 22,  duration: 110, useNativeDriver: true }),
        Animated.timing(robotX, { toValue: -10, duration: 90,  useNativeDriver: true }),
        Animated.timing(robotX, { toValue: 0,   duration: 80,  useNativeDriver: true }),
      ]).start(() => {
        // Excited jumps
        Animated.sequence([
          Animated.timing(robotY, { toValue: -42, duration: 200, easing: Easing.out(Easing.quad),  useNativeDriver: true }),
          Animated.timing(robotY, { toValue:   0, duration: 185, easing: Easing.in(Easing.bounce), useNativeDriver: true }),
          Animated.timing(robotY, { toValue: -22, duration: 165, useNativeDriver: true }),
          Animated.timing(robotY, { toValue:   0, duration: 150, easing: Easing.in(Easing.quad),   useNativeDriver: true }),
        ]).start(() => {
          // Bubble pops in
          Animated.parallel([
            Animated.spring(bubbleOp, { toValue: 1, friction: 7,  useNativeDriver: true }),
            Animated.spring(bubbleSc, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true }),
          ]).start(() => {
            setTimeout(() => {
              // Bubble out, then sprint left
              Animated.parallel([
                Animated.timing(bubbleOp, { toValue: 0,   duration: 200, useNativeDriver: true }),
                Animated.timing(bubbleSc, { toValue: 0.5, duration: 200, useNativeDriver: true }),
              ]).start(() => {
                setRunning(true);
                Animated.timing(robotX, {
                  toValue: -(SCREEN_WIDTH + 160),
                  duration: 1400,
                  easing: Easing.inOut(Easing.quad),
                  useNativeDriver: true,
                }).start(() => {
                  Animated.timing(overlayOp, {
                    toValue: 0, duration: 360, useNativeDriver: true,
                  }).start(() => onComplete?.());
                });
              });
            }, 2500);
          });
        });
      });
    });
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOp }]} pointerEvents="auto">
      <View style={is.bg} />
      <View style={is.titleBlock}>
        <Text style={is.titleMain}>Project Views</Text>
        <Text style={is.titleSub}>Your campus robot assistant</Text>
      </View>

      <Animated.View style={[is.stage, { transform: [{ translateX: robotX }, { translateY: robotY }] }]}>
        {/* Speech bubble */}
        <Animated.View style={[is.bubble, { opacity: bubbleOp, transform: [{ scale: bubbleSc }] }]}>
          <Text style={is.bLine1}>Hey guys!!</Text>
          <Text style={is.bLine2}>Welcome to</Text>
          <Text style={is.bLine3}>Project Views!</Text>
          <View style={is.bTail} />
        </Animated.View>
        <RobotCharacter isRunning={running} scale={1.2} />
      </Animated.View>

      <View style={is.ground} />
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  PEEKING ROBOT
//  The robot container is ROBOT_W wide. We translate it so that only ~36px
//  (the right side of the head) is visible from the left edge. When it
//  "peeks", it slides right so ~55px of helmet is visible — just a lean-in.
// ─────────────────────────────────────────────────────────────────────────────
// At 28deg rotation with feet as pivot, head x-offset ≈ 143 * sin(28°) ≈ 67px.
// PEEK_VISIBLE places feet at x=-38 so head lands ~29px inside screen ✓
// PEEK_HIDDEN pushes feet far enough left that head is also off-screen.
const PEEK_HIDDEN  = -200;   // antenna at -75px — fully off screen
const PEEK_VISIBLE = -75;    // head at ~+25px in frame, feet off left edge
const WITTY_COMMENTS = [
  "still here? 👀",
  "need a hand?",
  "i see you 🤖",
  "boop boop 🔵",
  "call me maybe?",
  "just checking in",
  "press the button!",
  "i'm right here...",
  "hello friendo 👋",
  "beep boop beep",
  "robot things 🤷",
  "you good? 👁️",
];

const PeekingRobot = ({ active }) => {
  const peekX      = useRef(new Animated.Value(PEEK_HIDDEN)).current;
  const peekBob    = useRef(new Animated.Value(0)).current;
  const bubbleOp   = useRef(new Animated.Value(0)).current;
  const bubbleSc   = useRef(new Animated.Value(0.6)).current;
  const bubbleX    = useRef(new Animated.Value(-20)).current; // Start slightly left
  const timerA     = useRef(null);
  const timerB     = useRef(null);
  const [comment, setComment]       = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const commentIdx = useRef(0);

  const nextComment = useCallback(() => {
    const idx = commentIdx.current % WITTY_COMMENTS.length;
    commentIdx.current += 1;
    return WITTY_COMMENTS[idx];
  }, []);

  const doPeek = useCallback(() => {
    const withComment = Math.random() < 0.7;

    Animated.sequence([
      Animated.timing(peekX, {
        toValue: PEEK_VISIBLE,
        duration: 520,
        easing: Easing.out(Easing.back(1.3)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      const bobLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(peekBob, { toValue: -8, duration: 400, useNativeDriver: true }),
          Animated.timing(peekBob, { toValue:  0, duration: 400, useNativeDriver: true }),
        ]),
        { iterations: 3 }
      );
      bobLoop.start();

      if (withComment) {
        setComment(nextComment());
        setTimeout(() => {
          setShowBubble(true);
          Animated.parallel([
            Animated.spring(bubbleOp, { toValue: 1, friction: 7, useNativeDriver: true }),
            Animated.spring(bubbleSc, { toValue: 1, friction: 5, tension: 160, useNativeDriver: true }),
            Animated.spring(bubbleX,  { toValue: 0, friction: 5, useNativeDriver: true }), // Slide into position
          ]).start();
        }, 300);
      }

      setTimeout(() => {
        bobLoop.stop();
        Animated.parallel([
          Animated.timing(bubbleOp, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(bubbleSc, { toValue: 0.6, duration: 200, useNativeDriver: true }),
          Animated.timing(bubbleX,  { toValue: -15, duration: 200, useNativeDriver: true }),
        ]).start(() => {
          setShowBubble(false);
          Animated.timing(peekX, {
            toValue: PEEK_HIDDEN,
            duration: 360,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }).start(() => {
            Animated.timing(peekBob, { toValue: 0, duration: 100, useNativeDriver: true }).start();
          });
        });
      }, 3000);
    });
  }, [nextComment]);

  const scheduleNext = useCallback(() => {
    const delay = 11000 + Math.random() * 9000;
    timerA.current = setTimeout(() => {
      doPeek();
      scheduleNext();
    }, delay);
  }, [doPeek]);

  useEffect(() => {
    if (!active) return;
    timerB.current = setTimeout(() => {
      doPeek();
      scheduleNext();
    }, 3500);
    return () => {
      clearTimeout(timerA.current);
      clearTimeout(timerB.current);
    };
  }, [active]);

  if (!active) return null;

  const HALF_H = 57;

  return (
    <View style={ps.stage} pointerEvents="none">
      <Animated.View
        style={[
          ps.robotPivot,
          {
            transform: [
              { translateX: peekX },
              { translateY: peekBob },
              { translateY: HALF_H },
              { rotate: '45deg' },
              { translateY: -HALF_H },
            ],
          },
        ]}
      >
        <RobotCharacter scale={0.75} facingLeft={false} />
      </Animated.View>

      {showBubble && (
        <Animated.View
          style={[
            ps.commentBubble,
            { 
                opacity: bubbleOp, 
                transform: [
                    { scale: bubbleSc },
                    { translateX: bubbleX }
                ] 
            },
          ]}
        >
          <Text style={ps.commentText}>{comment}</Text>
          <View style={ps.commentTail} />
        </Animated.View>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    available: { label: 'Available',   color: '#4ADE80', bg: '#052E16' },
    coming:    { label: 'On the way',  color: '#60A5FA', bg: '#0C1F3F' },
    arrived:   { label: 'Arrived! 🎉', color: '#A78BFA', bg: '#1E1040' },
    busy:      { label: 'Busy',        color: '#FBBF24', bg: '#1C1200' },
  };
  const c = cfg[status] || cfg.available;
  return (
    <View style={[bs.badge, { backgroundColor: c.bg, borderColor: c.color + '55' }]}>
      <View style={[bs.dot, { backgroundColor: c.color }]} />
      <Text style={[bs.label, { color: c.color }]}>{c.label}</Text>
    </View>
  );
};

const Step = ({ number, icon, text }) => (
  <View style={s.step}>
    <View style={s.stepBadge}><Text style={s.stepNum}>{number}</Text></View>
    <Text style={s.stepText}>{icon}  {text}</Text>
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
//  HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const HomeScreen = () => {
  const navigation = useNavigation();
  const { robotData, requestRobot, cancelRequest, loading } = useRobot();
  const [introComplete, setIntroComplete] = useState(false);
  const [userLocation] = useState({ x: 100, y: 200 });
  const contentY  = useRef(new Animated.Value(28)).current;
  const contentOp = useRef(new Animated.Value(0)).current;

  const isCallActive     = robotData.status === 'coming' || robotData.status === 'arrived';
  const isRobotAvailable = robotData.status === 'available';

  const handleIntroComplete = () => {
    setIntroComplete(true);
    Animated.parallel([
      Animated.timing(contentOp, { toValue: 1, duration: 460, useNativeDriver: true }),
      Animated.timing(contentY,  { toValue: 0, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  };

  const handleCallRobot = async () => {
    try { await requestRobot(userLocation); }
    catch { Alert.alert('Error', 'Failed to call robot. Please try again.'); }
  };

  const handleCancel = () => {
    Alert.alert('Cancel Request', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel', style: 'destructive',
        onPress: async () => {
          try { await cancelRequest(); }
          catch { Alert.alert('Error', 'Failed to cancel request'); }
        },
      },
    ]);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#060D1A" />

      {/* App content */}
      <Animated.View style={[{ flex: 1 }, { opacity: contentOp, transform: [{ translateY: contentY }] }]}>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Hero */}

          <View style={s.hero}>
            <View style={s.heroRow}>
              <View>
                <Text style={s.heroTitle}>Project Views</Text>
                <Text style={s.heroSub}>Your campus robot assistant - ViewBot</Text>
              </View>

              {/* Replace StatusBadge with Image */}
              <Image
                source={{ uri: 'https://departments.johnabbott.qc.ca/wp-content/uploads/2020/05/john-abbott-college-2.png' }}
                style={{
                  width: 80,   // adjust width to match StatusBadge
                  height: 40,  // adjust height to match StatusBadge
                  resizeMode: 'contain',
                }}
              />
            </View>
          </View>

          {/* Robot status */}
          <View style={s.section}>
            <RobotStatusCard robotData={robotData} />
          </View>

          {/* Action card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>{isCallActive ? 'Robot is on the way!' : 'Need Assistance?'}</Text>
            <Text style={s.cardSub}>
              {isCallActive
                ? 'Stay put — your robot is navigating to your location right now.'
                : 'Summon the ViewBot to your current location in a flash!'}
            </Text>

            {loading ? (
              <View style={s.loadingBox}>
                <ActivityIndicator size="large" color="#60A5FA" />
                <Text style={s.loadingText}>Dispatching robot…</Text>
              </View>
            ) : (
              <View style={s.btnStack}>
                {!isCallActive && (
                  <TouchableOpacity
                    style={[s.btn, s.btnPrimary, !isRobotAvailable && s.btnOff]}
                    onPress={() => {
                      
                      navigation.navigate('Control');
                    }}
                    disabled={!isRobotAvailable}
                    activeOpacity={0.8}
                  >
                    <Text style={s.btnPrimaryTxt}>ViewBot Control Center</Text>
                  </TouchableOpacity>
                )}
                {isCallActive && (
                  <TouchableOpacity style={[s.btn, s.btnDanger]} onPress={handleCancel} activeOpacity={0.8}>
                    <Text style={s.btnDangerTxt}>✕  Cancel Request</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[s.btn, s.btnSecondary]}
                  onPress={() => navigation.navigate('Map')} activeOpacity={0.8}
                >
                  <Text style={s.btnSecondaryTxt}>View Live Map</Text>
                </TouchableOpacity>
                {!isRobotAvailable && !isCallActive && (
                  <Text style={s.busyTxt}>⏳  Robot is busy — please wait</Text>
                )}
              </View>
            )}
          </View>

          {/* How it works */}
          <View style={[s.card, s.howCard]}>
            <Text style={s.howTitle}>How it works</Text>
            <Step number="1" text="Access ViewBot Control Center" />
            <Step number="2" text="Call ViewBot to your Current Location and Input Destination " />
            <Step number="3" text="Viewbot waits at your spot until User presses 'Start'" />
            <Step number="4" text="You walk to your destination with the robot!" />
            <Step number="*" text="For the demo, the robot can only be controlled from the Control Center and won't actually autonomously navigate." />
          </View>

          <View style={{ height: 48 }} />
        </ScrollView>
      </Animated.View>

      {/* Peeking robot — clipped to left edge */}
      <PeekingRobot active={introComplete} />

      {/* Intro overlay */}
      {!introComplete && <RobotIntro onComplete={handleIntroComplete} />}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────────────────────────────────────

// Robot character styles
const rc = StyleSheet.create({
  root: { alignItems: 'center' },
  inner: { alignItems: 'center' },

  antennaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: ROBOT_W,
    justifyContent: 'center',
    marginBottom: -2,
  },
  antennaWrap: { alignItems: 'center' },
  antennaShaft: { width: 4, height: 20, backgroundColor: '#8090A0', borderRadius: 2 },
  antennaTip: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#FFB0A0',
    borderWidth: 1.5, borderColor: '#CC7060',
    marginBottom: 1,
    shadowColor: '#FF8070', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 4, elevation: 4,
  },

  // Big round helmet
  helmet: {
    width: 92, height: 88,
    borderRadius: 46,
    backgroundColor: '#D8DDE5',
    borderWidth: 3, borderColor: '#3A3F4A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  visor: {
    width: 66, height: 58,
    borderRadius: 14,
    backgroundColor: '#1A2A35',
    borderWidth: 2, borderColor: '#2A3A45',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 8,
  },
  glare1: {
    position: 'absolute', top: 5, left: 7,
    width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.55)',
  },
  glare2: {
    position: 'absolute', top: 5, left: 20,
    width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)',
  },
  eyeRow: { flexDirection: 'row', gap: 14, marginBottom: 8 },
  eye: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#4DD9F0',
    shadowColor: '#4DD9F0', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 7, elevation: 5,
  },
  mouthBar: {
    width: 22, height: 5, borderRadius: 3,
    backgroundColor: '#4DD9F0', opacity: 0.75,
  },
  ventRow: { flexDirection: 'row', gap: 3, marginTop: 4 },
  vent: { width: 5, height: 7, borderRadius: 2, backgroundColor: '#8090A0' },

  neck: { width: 22, height: 8, backgroundColor: '#A0AAB4', borderRadius: 3, borderWidth: 1, borderColor: '#3A3F4A' },

  // Torso
  torsoRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 1 },
  armWrap: { alignItems: 'center', marginTop: 8 },
  armShaft: { width: 18, height: 36, backgroundColor: '#B0BCC8', borderRadius: 9, borderWidth: 2, borderColor: '#3A3F4A' },
  fist: {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: '#8090A0', borderWidth: 2, borderColor: '#3A3F4A',
    marginTop: -2,
  },

  body: {
    width: 74, height: 72,
    backgroundColor: '#C8D0D8',
    borderRadius: 16, borderWidth: 2.5, borderColor: '#3A3F4A',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5,
  },
  shoulderLine: {
    position: 'absolute', top: 9, left: 4, right: 4, height: 3,
    backgroundColor: '#A0AAB4', borderRadius: 2,
  },
  chestRing: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 3, borderColor: '#4DD9F0',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1A2A35',
    marginBottom: 6,
    shadowColor: '#4DD9F0', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
  },
  chestCore: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#4DD9F0',
    shadowColor: '#4DD9F0', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 5, elevation: 3,
  },
  accentRow: { flexDirection: 'row', gap: 20 },
  accentDot: { width: 7, height: 7, borderRadius: 4 },

  // Lower
  waist: { width: 56, height: 10, backgroundColor: '#9AA4AE', borderRadius: 3, borderWidth: 1.5, borderColor: '#3A3F4A' },
  legRow: { flexDirection: 'row', gap: 10, marginTop: 2 },
  legWrap: { alignItems: 'center' },
  legShaft: { width: 20, height: 22, backgroundColor: '#B0BCC8', borderRadius: 6, borderWidth: 2, borderColor: '#3A3F4A' },
  boot: { width: 28, height: 14, borderRadius: 7, backgroundColor: '#707880', borderWidth: 2, borderColor: '#3A3F4A', marginTop: 1 },
});

// Intro overlay
const is = StyleSheet.create({
  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#060D1A' },
  titleBlock: {
    position: 'absolute', top: SCREEN_HEIGHT * 0.1,
    left: 0, right: 0, alignItems: 'center',
  },
  titleMain: { fontSize: 38, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.6 },
  titleSub: { fontSize: 15, color: '#94A3B8', marginTop: 6 },
  stage: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.16,
    left: 0, right: 0, alignItems: 'center',
  },
  bubble: {
    backgroundColor: '#FFFFFF', borderRadius: 18,
    paddingHorizontal: 24, paddingVertical: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 10,
    alignItems: 'center',
  },
  bLine1: { fontSize: 17, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  bLine2: { fontSize: 14, color: '#475569', marginTop: 3, textAlign: 'center' },
  bLine3: { fontSize: 17, fontWeight: '700', color: '#0891B2', textAlign: 'center' },
  bTail: {
    position: 'absolute', bottom: -13, left: '50%', marginLeft: -11,
    width: 0, height: 0,
    borderLeftWidth: 11, borderRightWidth: 11, borderTopWidth: 15,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#FFFFFF',
  },
  ground: {
    position: 'absolute', bottom: SCREEN_HEIGHT * 0.13,
    left: 0, right: 0, height: 2, backgroundColor: '#1E293B',
  },
});

// Peeking styles
// No overflow:hidden needed — the screen's left edge naturally clips the feet.
// The robot is rotated clockwise ~28deg with its FEET as the pivot point,
// so the head swings into the screen while feet stay off the left edge.
const ps = StyleSheet.create({
  stage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  robotPivot: {
    position: 'absolute',
    left: 0,
    // Moved up by subtracting ~80px (approx 2cm)
    top: SCREEN_HEIGHT * 0.5 - 140, 
  },
  commentBubble: {
    position: 'absolute',
    left: 45,                         
    // Moved up accordingly to stay near the head
    top: SCREEN_HEIGHT * 0.5 - 110,   
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 7,
  },
  commentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  commentTail: {
    position: 'absolute',
    left: -8,
    top: 12,
    width: 0, height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
});
// Status badge
const bs = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 11, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: '700' },
});

// Main screen
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060D1A' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  hero: {
    backgroundColor: '#0A1628',
    paddingTop: 60, paddingBottom: 26, paddingHorizontal: 20,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    borderBottomWidth: 1, borderColor: '#1E293B',
  },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 3 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.6 },
  heroSub: { fontSize: 13, color: '#94A3B8', marginTop: 2 },

  section: { paddingHorizontal: 16, marginTop: 18 },

  card: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: '#0D1929', borderRadius: 24, padding: 22,
    borderWidth: 1, borderColor: '#1E3A5F',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 18, elevation: 8,
  },
  cardEmoji: { fontSize: 32, marginBottom: 8 },
  cardTitle: { fontSize: 21, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.3, marginBottom: 6 },
  cardSub: { fontSize: 14, color: '#94A3B8', lineHeight: 22, marginBottom: 20 },

  btnStack: { gap: 11 },
  btn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  btnPrimary: {
    backgroundColor: '#0891B2',
    shadowColor: '#0891B2', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.55, shadowRadius: 12, elevation: 7,
  },
  btnPrimaryTxt: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  btnDanger: { backgroundColor: '#450A0A', borderWidth: 1, borderColor: '#EF4444' },
  btnDangerTxt: { fontSize: 16, fontWeight: '700', color: '#FCA5A5' },
  btnSecondary: { borderWidth: 1.5, borderColor: '#1E3A5F' },
  btnSecondaryTxt: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  btnOff: { opacity: 0.38 },
  busyTxt: { textAlign: 'center', color: '#FBBF24', fontSize: 14, fontWeight: '600', marginTop: 4 },

  loadingBox: { alignItems: 'center', paddingVertical: 22, gap: 12 },
  loadingText: { color: '#94A3B8', fontSize: 14, fontWeight: '500' },

  howCard: { backgroundColor: '#080F1E', borderColor: '#162035' },
  howTitle: { fontSize: 17, fontWeight: '800', color: '#E2E8F0', marginBottom: 16 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepBadge: {
    width: 30, height: 30, borderRadius: 9, backgroundColor: '#1E3A5F',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  stepNum: { fontSize: 13, fontWeight: '800', color: '#4DD9F0' },
  stepText: { fontSize: 14, color: '#94A3B8', fontWeight: '500', flex: 1 },
});

export default HomeScreen;