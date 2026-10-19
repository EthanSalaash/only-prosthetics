import { Activity, Car, Zap, Shield, Brain, HandMetal } from 'lucide-react';

export const PROSTHETIC_INVENTORY = [
  {
    id: 'prod-001',
    name: 'Quantum Electric Wheelchair',
    category: 'Mobility Assist',
    description: 'Advanced powered wheelchair with customized joystick mounting and adaptive suspension.',
    imgSrc: '/Quantum Electric Wheelchair.png',
    requiresClearance: true,
    cost: 350000, // Adjusted to ~350k KES
    icon: Zap
  },
  {
    id: 'prod-002',
    name: 'Carbon-Fiber Socket Liner',
    category: 'Lower Limb',
    description: 'High-impact energy return socket liner for athletic prostheses and gait stability.',
    imgSrc: '/Carbon-Fiber Socket Liner.png',
    requiresClearance: true,
    cost: 85000, // Adjusted to ~85k KES
    icon: Activity
  },
  {
    id: 'prod-003',
    name: 'Sensory-Feedback Glove',
    category: 'Upper Limb (Neural)',
    description: 'Maps movement signals to the nervous system, providing real-time touch feedback.',
    imgSrc: '/Sensory-Feedback-Glove.png',
    requiresClearance: true,
    cost: 650000, // Adjusted to ~650k KES
    icon: HandMetal
  },
  {
    id: 'prod-004',
    name: 'Adaptive Driving Matrix',
    category: 'Vehicle Modification',
    description: 'Steering column-mounted push/pull hand controls. Requires DRS evaluation.',
    imgSrc: '/Adaptived-Driving.png',
    requiresClearance: true,
    cost: 185000, // Adjusted to ~185k KES for custom machining and installation
    icon: Car
  },
  {
    id: 'prod-005',
    name: 'Powered Exo-Skeleton',
    category: 'Exoskeleton',
    description: 'Provides dedicated knee-motor assistance, reducing muscle fatigue by up to 40%.',
    imgSrc: '/Exo-Skeleton.png',
    requiresClearance: false,
    cost: 150000, // Adjusted to ~150k KES
    icon: Shield
  },
  {
    id: 'prod-006',
    name: 'Neuro-Prosthetics BCI',
    category: 'Neural Interface',
    description: 'Osseointegrated Brain-Computer Interface for seamless arm control and sensory loops.',
    imgSrc: '/neuro-prosthetics.png',
    requiresClearance: true,
    cost: 2800000, // Advanced surgical BCI tech adjusted to ~2.8m KES
    icon: Brain
  }
];