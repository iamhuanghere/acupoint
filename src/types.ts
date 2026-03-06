export interface AcupointFunction {
  icon: string;
  title: string;
  subtitle: string;
}

export interface Technique {
  title: string;
  description: string;
}

export interface Acupoint {
  id: string;
  name: string;
  code: string;
  englishName: string;
  meridian: string;
  location: string;
  functions: AcupointFunction[];
  techniques: Technique[];
  contraindication?: string;
  image: string;
  category: 'Head' | 'Torso' | 'Arms' | 'Legs';
  tags: string[];
  description: string;
}

export const ACUPOINTS: Acupoint[] = [
  {
    id: 'li4',
    name: 'Hegu',
    code: 'LI4',
    englishName: 'Union Valley',
    meridian: 'Large Intestine Meridian',
    location: 'On the dorsum of the hand, between the 1st and 2nd metacarpal bones, at the midpoint of the radial side of the 2nd metacarpal bone. When the thumb and index finger are adducted, the point is at the highest spot of the muscle.',
    description: 'One of the most important points in acupuncture, primarily used for pain relief and head-related issues.',
    functions: [
      { icon: 'Headphones', title: 'Headache', subtitle: 'Frontal & Migraines' },
      { icon: 'Stethoscope', title: 'Toothache', subtitle: 'Oral inflammation' },
      { icon: 'Thermometer', title: 'Fever', subtitle: 'Common cold/Flu' },
      { icon: 'Activity', title: 'Pain Relief', subtitle: 'General analgesic' },
    ],
    techniques: [
      { title: 'Massage (Acupressure)', description: 'Apply deep, firm pressure. Use your thumb to press into the point on the opposite hand. Rotate in small circles for 2-3 minutes. Repeat on the other side.' },
      { title: 'Moxibustion', description: 'Use a moxa stick to apply mild warmth to the point for 5-10 minutes until the skin becomes slightly red. Use caution to avoid burns.' },
    ],
    contraindication: 'Do not use this point during pregnancy as it may induce labor.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk26B13awo8rvIysU--lvvwa12CPoOz1iM6IvfmmpByFVFyoqZD-DE1nmu_9knTv7R18Xe15AwQmtAa_P35Os6w6gaFLcBa63N6-Xdgizqw70jDTfmurosDPrrCnf-tNiqsLE9EegM6pwubQk-Uegm8aGl-3AkcM-BiwOkAsVibjVKOh3xUVla2eJoedN5YGHun9pvwJJTYoN0eS4rQNPdhNj9v9y5h8CPptZXPg3dujM58t4u5h-OJ4KNuObLqDAHJQNzZseIcV8',
    category: 'Arms',
    tags: ['Pain Relief', 'Digestion'],
  },
  {
    id: 'gv24-5',
    name: 'Yintang',
    code: 'GV24.5',
    englishName: 'The Hall of Impression',
    meridian: 'Governor Vessel',
    location: 'At the midpoint between the two eyebrows.',
    description: 'Calms the mind, relieves headaches, and helps with nasal congestion and insomnia.',
    functions: [
      { icon: 'Moon', title: 'Insomnia', subtitle: 'Sleep disorders' },
      { icon: 'Brain', title: 'Anxiety', subtitle: 'Calms the spirit' },
    ],
    techniques: [
      { title: 'Gentle Press', description: 'Apply gentle pressure with your index finger for 1-2 minutes.' },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB66E3-7maE7e3I72A0G4n2MYBzVZ_zbKLTG5bappa8B8UEwyiF5ycHXh7q_ir5M6Jgj9LeXxWbR5G3ySxVepe3IyOrkKn3rU8dvIM5LHoDpbR3Gmb9h2Dml8_qrbIqTnP8bFXeJ5BKKxNjcLUn4u0lF_BzAqqCTCzBtMvxu34uiC2nlTVHk_449ESwZgFaMwgxiBY_92-_ibJzn4d9DtlBRm4NGvAOLVHSe8JnamRROVBQsjajigIMpuOrjeTmpXh7xhYY4bHsEoI',
    category: 'Head',
    tags: ['Sleep', 'Pain Relief'],
  },
  {
    id: 'ex-hn5',
    name: 'Taiyang',
    code: 'EX-HN5',
    englishName: 'Supreme Yang',
    meridian: 'Extra Point',
    location: 'In the depression about one finger-breadth posterior to the midpoint between the lateral end of the eyebrow and the outer canthus.',
    description: 'Excellent for migraines, eye strain, and clearing heat from the head.',
    functions: [
      { icon: 'Eye', title: 'Eye Strain', subtitle: 'Vision fatigue' },
      { icon: 'Zap', title: 'Migraine', subtitle: 'Severe headache' },
    ],
    techniques: [
      { title: 'Circular Massage', description: 'Massage both temples simultaneously with circular motions.' },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4JvdijZLHt5EbC98CNGiXk0xhSWoDABF8MZy2GvGm_nCls7PnRYUkRQX_jDjDF57R27UU8WUaW7sp7qIpSTPFhXVlZG5ncFnVWr8LS7L4vAY7Vn8Dm_z-ZfjkUlxeaWllOTj1MBtz6zgBsODqc6tU-A7dP4miChajjJbWXEBmUNMQN-V28H9SUvjh1h35yqZYxXRKq0Bhr93bUE2m9u66Igekz04dAITqM6Rs6qHpSUbn2wk3QE1RMnSKgCAq2BVnJXwVZaRIxRw',
    category: 'Head',
    tags: ['Pain Relief'],
  }
];
