// Dummy data for the Smart Retention System
export const organizationStats = {
  turnoverReduction: 87,
  revenueIncrease: 43,
  customerSatisfactionIncrease: 12,
  totalEmployees: 1247,
  riskEmployees: 23,
  avgEngagementScore: 8.2,
  avgStressLevel: 3.1
};

export const turnoverRiskData = [
  { month: 'Jan', risk: 12, actual: 8 },
  { month: 'Feb', risk: 15, actual: 11 },
  { month: 'Mar', risk: 18, actual: 14 },
  { month: 'Apr', risk: 22, actual: 19 },
  { month: 'May', risk: 16, actual: 12 },
  { month: 'Jun', risk: 14, actual: 10 },
  { month: 'Jul', risk: 11, actual: 8 },
  { month: 'Aug', risk: 13, actual: 9 },
  { month: 'Sep', risk: 17, actual: 13 },
  { month: 'Oct', risk: 20, actual: 16 },
  { month: 'Nov', risk: 23, actual: 18 },
  { month: 'Dec', risk: 19, actual: 15 }
];

export const engagementHeatmapData = [
  { team: 'Engineering', engagement: 8.5, stress: 3.2, size: 45 },
  { team: 'Sales', engagement: 7.8, stress: 4.1, size: 32 },
  { team: 'Marketing', engagement: 8.1, stress: 2.9, size: 28 },
  { team: 'HR', engagement: 8.9, stress: 2.5, size: 12 },
  { team: 'Finance', engagement: 7.2, stress: 3.8, size: 18 },
  {team: 'Operations', engagement: 7.9, stress: 3.5, size: 22 },
  { team: 'Product', engagement: 8.7, stress: 3.0, size: 19 },
  { team: 'Customer Support', engagement: 7.5, stress: 4.2, size: 25 }
];

export const feedbackData = [
  {
    id: 1,
    type: 'peer',
    from: 'Dzikri Razzan Athallah',
    to: 'You',
    project: 'Q4 Product Launch',
    content: 'Great collaboration on the user interface design. Your attention to detail really made a difference.',
    date: '2024-01-15',
    status: 'received'
  },
  {
    id: 2,
    type: 'manager',
    from: 'Bravely Dirgayuska',
    to: 'You',
    project: 'Team Leadership',
    content: 'Excellent job mentoring new team members. Your leadership skills have grown significantly.',
    date: '2024-01-12',
    status: 'received'
  },
  {
    id: 3,
    type: 'self',
    from: 'You',
    to: 'Putri Aulia Simanjuntak',
    project: 'Process Improvement',
    content: 'I implemented automated testing which reduced deployment time by 40%.',
    date: '2024-01-10',
    status: 'sent'
  }
];

export interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'not-started';
  priority: 'high' | 'medium' | 'low';
  owner: string;
  keyResults: KeyResult[];
}

export interface KeyResult {
  description: string;
  completed: boolean;
}

export const goalsData: Goal[] = [
  {
    id: 1,
    title: "Improve Team Collaboration",
    description: "Enhance cross-functional team communication and collaboration through better tools and processes.",
    progress: 85,
    dueDate: "2024-12-31",
    status: "in-progress",
    priority: "high",
    owner: "Bravely Dirgayuska",
    keyResults: [
      { description: "Implement new project management tool", completed: true },
      { description: "Conduct team collaboration workshops", completed: true },
      { description: "Establish weekly cross-team sync meetings", completed: false }
    ]
  },
  {
    id: 2,
    title: "Increase Customer Satisfaction",
    description: "Improve customer satisfaction scores through enhanced service delivery and support processes.",
    progress: 70,
    dueDate: "2024-11-30",
    status: "in-progress",
    priority: "high",
    owner: "Dzikri Razzan Athallah",
    keyResults: [
      { description: "Reduce average response time to under 2 hours", completed: true },
      { description: "Achieve 95% customer satisfaction rating", completed: false },
      { description: "Launch customer feedback portal", completed: true }
    ]
  },
  {
    id: 3,
    title: "Digital Transformation Initiative",
    description: "Lead the company's digital transformation by modernizing key systems and processes.",
    progress: 45,
    dueDate: "2025-03-31",
    status: "in-progress",
    priority: "medium",
    owner: "Bravely Dirgayuska",
    keyResults: [
      { description: "Migrate legacy systems to cloud", completed: false },
      { description: "Train staff on new digital tools", completed: true },
      { description: "Implement automated workflows", completed: false }
    ]
  },
  {
    id: 4,
    title: "Talent Development Program",
    description: "Create a comprehensive talent development program to enhance employee skills and career growth.",
    progress: 100,
    dueDate: "2024-10-31",
    status: "completed",
    priority: "medium",
    owner: "Putri Aulia Simanjuntak",
    keyResults: [
      { description: "Design learning curriculum", completed: true },
      { description: "Launch mentorship program", completed: true },
      { description: "Establish career progression framework", completed: true }
    ]
  },
  {
    id: 5,
    title: "Revenue Growth Strategy",
    description: "Develop and execute strategies to increase revenue by 25% through new market opportunities.",
    progress: 60,
    dueDate: "2024-12-31",
    status: "in-progress",
    priority: "high",
    owner: "Tasya Salsabila",
    keyResults: [
      { description: "Identify three new market segments", completed: true },
      { description: "Launch two new product lines", completed: false },
      { description: "Establish partnerships with key distributors", completed: true }
    ]
  }
];

export const oneOnOneData = [
  {
    id: 1,
    with: 'Bravely Dirgayuska',
    date: '2024-01-20',
    time: '10:00 AM',
    agenda: ['Career development', 'Q1 goals review', 'Team feedback'],
    notes: 'Discuss promotion timeline and skill development plan',
    status: 'upcoming'
  },
  {
    id: 2,
    with: 'Dzikri Razzan Athallah',
    date: '2024-01-18',
    time: '2:00 PM',
    agenda: ['Project collaboration', 'Process improvements'],
    notes: 'Great insights on cross-team communication',
    status: 'completed'
  }
];

export const shoutoutsData = [
  {
    id: 1,
    from: 'Putri Aulia Simanjuntak',
    to: 'Tasya Salsabila',
    message: 'Amazing work on the client presentation! Your research was thorough and the delivery was flawless.',
    values: ['Excellence', 'Collaboration'],
    emoji: '🌟',
    date: '2024-01-15',
    likes: 12
  },
  {
    id: 2,
    from: 'Bravely Dirgayuska',
    to: 'Engineering Team',
    message: 'Thank you for the quick turnaround on the bug fixes. Your dedication kept our customers happy!',
    values: ['Customer Focus', 'Teamwork'],
    emoji: '🚀',
    date: '2024-01-14',
    likes: 8
  },
  {
    id: 3,
    from: 'Dzikri Razzan Athallah',
    to: 'Annisa Azalia Maulana',
    message: 'The new design system is incredible! It will make our development process so much more efficient.',
    values: ['Innovation', 'Excellence'],
    emoji: '🎨',
    date: '2024-01-13',
    likes: 15
  }
];

export const learningData = [
  {
    id: 1,
    title: 'Effective Remote Leadership',
    type: 'micro-learning',
    duration: '5 min',
    content: 'Learn key strategies for leading distributed teams effectively in the modern workplace...',
    completed: false,
    helpful: 0
  },
  {
    id: 2,
    title: 'Data-Driven Decision Making',
    type: 'article',
    duration: '8 min',
    content: 'How to use analytics and data insights to improve business outcomes and make informed decisions...',
    completed: true,
    helpful: 5
  },
  {
    id: 3,
    title: 'Advanced Communication Skills',
    type: 'micro-learning',
    duration: '7 min',
    content: 'Master the art of clear, concise, and impactful communication in professional settings...',
    completed: false,
    helpful: 0
  },
  {
    id: 4,
    title: 'Project Management Fundamentals',
    type: 'course',
    duration: '15 min',
    content: 'Essential project management principles and methodologies for successful project delivery...',
    completed: true,
    helpful: 8
  }
];

export const performanceReviewData = {
  selfReview: {
    achievements: [
      'Led successful migration to new tech stack',
      'Mentored 3 junior developers',
      'Improved code quality metrics by 35%',
      'Delivered 5 major features ahead of schedule'
    ],
    challenges: [
      'Time management during peak periods',
      'Need better cross-team communication',
      'Balancing technical debt with new features'
    ],
    goals: [
      'Obtain AWS certification',
      'Lead larger cross-functional projects',
      'Improve public speaking skills',
      'Contribute to open source projects'
    ]
  },
  managerFeedback: {
    strengths: ['Technical expertise', 'Team collaboration', 'Problem solving', 'Mentorship', 'Innovation'],
    improvements: ['Project planning', 'Time estimation', 'Documentation', 'Stakeholder communication'],
    rating: 4.2
  }
};

// Additional data for enhanced features
export const userData = [
  {
    id: 1,
    employeeId: 'EMP001',
    name: 'Dzikri Razzan Athallah',
    email: 'dzikri.razzan@company.com',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    joinDate: '2023-01-15',
    status: 'active',
    phone: '+62 812-3456-7890',
    location: 'Jakarta',
    manager: 'Bravely Dirgayuska',
    role: 'user'
  },
  {
    id: 2,
    employeeId: 'EMP002',
    name: 'Bravely Dirgayuska',
    email: 'bravely.dirgayuska@company.com',
    position: 'Engineering Manager',
    department: 'Engineering',
    joinDate: '2022-08-20',
    status: 'active',
    phone: '+62 813-4567-8901',
    location: 'Bandung',
    manager: 'CTO',
    role: 'admin'
  },
  {
    id: 3,
    employeeId: 'EMP003',
    name: 'Putri Aulia Simanjuntak',
    email: 'putri.aulia@company.com',
    position: 'Product Manager',
    department: 'Product',
    joinDate: '2023-03-10',
    status: 'active',
    phone: '+62 814-5678-9012',
    location: 'Jakarta',
    manager: 'VP Product',
    role: 'user'
  },
  {
    id: 4,
    employeeId: 'EMP004',
    name: 'Tasya Salsabila',
    email: 'tasya.salsabila@company.com',
    position: 'Senior Developer',
    department: 'Engineering',
    joinDate: '2022-11-05',
    status: 'active',
    phone: '+62 815-6789-0123',
    location: 'Surabaya',
    manager: 'Bravely Dirgayuska',
    role: 'user'
  },
  {
    id: 5,
    employeeId: 'EMP005',
    name: 'Annisa Azalia Maulana',
    email: 'annisa.azalia@company.com',
    position: 'UX Designer',
    department: 'Design',
    joinDate: '2023-06-12',
    status: 'active',
    phone: '+62 816-7890-1234',
    location: 'Jakarta',
    manager: 'Design Lead',
    role: 'user'
  }
];