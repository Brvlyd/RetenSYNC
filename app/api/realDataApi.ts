// Real data integration for feedback functionality
import { fetchUsers, User } from './usersApi';

export interface FeedbackData {
  id: number;
  type: 'peer' | 'manager' | 'self';
  from: string;
  to: string;
  project: string;
  content: string;
  date: string;
  status: 'received' | 'sent';
  rating?: number;
  helpful?: number;
}

export interface ShoutoutData {
  id: number;
  from: string;
  to: string;
  message: string;
  values: string[];
  emoji: string;
  date: string;
  likes: number;
}

export interface OneOnOneData {
  id: number;
  with: string;
  date: string;
  time: string;
  agenda: string[];
  notes: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface GoalData {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'not-started';
  priority: 'high' | 'medium' | 'low';
  owner: string;
  keyResults: Array<{
    description: string;
    completed: boolean;
  }>;
}

// Generate realistic feedback data based on real users
export const generateFeedbackData = async (): Promise<FeedbackData[]> => {
  try {
    const users = await fetchUsers();
    const feedback: FeedbackData[] = [];
    
    const feedbackTemplates = [
      {
        type: 'peer' as const,
        projects: ['Q4 Product Launch', 'System Migration', 'User Experience Redesign', 'Performance Optimization'],
        content: [
          'Great collaboration on the project. Your technical expertise really helped us deliver on time.',
          'Excellent problem-solving skills and attention to detail throughout the project.',
          'Your communication and leadership during the project were outstanding.',
          'Really appreciate your innovative approach to solving complex challenges.'
        ]
      },
      {
        type: 'manager' as const,
        projects: ['Performance Review', 'Project Leadership', 'Team Collaboration', 'Client Presentation'],
        content: [
          'Excellent progress on your goals this quarter. Keep up the great work!',
          'Your leadership skills have grown significantly over the past few months.',
          'Outstanding client presentation. Your preparation and delivery were flawless.',
          'Great job mentoring the new team members and helping them integrate.'
        ]
      },
      {
        type: 'self' as const,
        projects: ['Self Assessment', 'Goal Setting', 'Skills Development', 'Career Planning'],
        content: [
          'Focused on improving my technical skills and taking on more challenging projects.',
          'Successfully completed certification and applied new knowledge to current projects.',
          'Made significant progress on communication and presentation skills.',
          'Took initiative in cross-team collaboration and knowledge sharing.'
        ]
      }
    ];

    // Generate feedback for each user
    let feedbackId = 1;
    for (const user of users.slice(0, 20)) { // Limit to first 20 users for performance
      const numFeedback = Math.floor(Math.random() * 3) + 1; // 1-3 feedback per user
      
      for (let i = 0; i < numFeedback; i++) {
        const template = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
        const otherUser = users[Math.floor(Math.random() * users.length)];
        
        const isReceived = Math.random() > 0.5;
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        feedback.push({
          id: feedbackId++,
          type: template.type,
          from: isReceived ? otherUser.name : user.name,
          to: isReceived ? user.name : otherUser.name,
          project: template.projects[Math.floor(Math.random() * template.projects.length)],
          content: template.content[Math.floor(Math.random() * template.content.length)],
          date: date.toISOString().split('T')[0],
          status: isReceived ? 'received' : 'sent',
          rating: Math.floor(Math.random() * 5) + 1,
          helpful: Math.floor(Math.random() * 10)
        });
      }
    }
    
    return feedback;
  } catch (error) {
    console.error('Error generating feedback data:', error);
    return [];
  }
};

// Generate realistic shoutout data
export const generateShoutoutData = async (): Promise<ShoutoutData[]> => {
  try {
    const users = await fetchUsers();
    const shoutouts: ShoutoutData[] = [];
    
    const shoutoutTemplates = [
      {
        message: 'Amazing work on the project! Your dedication and expertise really made the difference.',
        values: ['Excellence', 'Teamwork'],
        emoji: '🌟'
      },
      {
        message: 'Thank you for the quick turnaround on the bug fixes. Your commitment to quality is outstanding!',
        values: ['Customer Focus', 'Quality'],
        emoji: '🚀'
      },
      {
        message: 'Great job leading the team through a challenging project. Your leadership skills shine!',
        values: ['Leadership', 'Innovation'],
        emoji: '💪'
      },
      {
        message: 'Your creative solution to the technical challenge was brilliant. Keep up the innovation!',
        values: ['Innovation', 'Problem Solving'],
        emoji: '💡'
      }
    ];

    // Generate shoutouts
    let shoutoutId = 1;
    for (let i = 0; i < Math.min(15, users.length); i++) { // Limit to 15 shoutouts
      const fromUser = users[Math.floor(Math.random() * users.length)];
      const toUser = users[Math.floor(Math.random() * users.length)];
      
      if (fromUser.id !== toUser.id) {
        const template = shoutoutTemplates[Math.floor(Math.random() * shoutoutTemplates.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 15));
        
        shoutouts.push({
          id: shoutoutId++,
          from: fromUser.name,
          to: toUser.name,
          message: template.message,
          values: template.values,
          emoji: template.emoji,
          date: date.toISOString().split('T')[0],
          likes: Math.floor(Math.random() * 20)
        });
      }
    }
    
    return shoutouts;
  } catch (error) {
    console.error('Error generating shoutout data:', error);
    return [];
  }
};

// Generate realistic goal data
export const generateGoalData = async (): Promise<GoalData[]> => {
  try {
    const users = await fetchUsers();
    const goals: GoalData[] = [];
    
    const goalTemplates = [
      {
        title: 'Improve Technical Skills',
        description: 'Enhance technical expertise through certification and hands-on projects',
        keyResults: [
          'Complete relevant certification',
          'Apply new skills to current projects',
          'Share knowledge with team members'
        ]
      },
      {
        title: 'Enhance Team Collaboration',
        description: 'Improve cross-functional collaboration and communication',
        keyResults: [
          'Participate in cross-team projects',
          'Facilitate knowledge sharing sessions',
          'Improve communication with stakeholders'
        ]
      },
      {
        title: 'Increase Project Efficiency',
        description: 'Optimize processes and improve delivery timelines',
        keyResults: [
          'Identify process improvements',
          'Implement efficiency measures',
          'Reduce project delivery time by 20%'
        ]
      },
      {
        title: 'Develop Leadership Skills',
        description: 'Build leadership capabilities and mentor team members',
        keyResults: [
          'Mentor junior team members',
          'Lead a cross-functional project',
          'Complete leadership training'
        ]
      }
    ];

    // Generate goals for users
    let goalId = 1;
    for (const user of users.slice(0, 10)) { // Limit to first 10 users
      const numGoals = Math.floor(Math.random() * 2) + 1; // 1-2 goals per user
      
      for (let i = 0; i < numGoals; i++) {
        const template = goalTemplates[Math.floor(Math.random() * goalTemplates.length)];
        
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + Math.floor(Math.random() * 6) + 1);
        
        const progress = Math.floor(Math.random() * 100);
        let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
        if (progress > 80) status = 'completed';
        else if (progress > 20) status = 'in-progress';
        
        const keyResults = template.keyResults.map(kr => ({
          description: kr,
          completed: Math.random() > 0.5
        }));
        
        goals.push({
          id: goalId++,
          title: template.title,
          description: template.description,
          progress,
          dueDate: dueDate.toISOString().split('T')[0],
          status,
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          owner: user.name,
          keyResults
        });
      }
    }
    
    return goals;
  } catch (error) {
    console.error('Error generating goal data:', error);
    return [];
  }
};

// Generate realistic 1-on-1 meeting data
export const generateOneOnOneData = async (): Promise<OneOnOneData[]> => {
  try {
    const users = await fetchUsers();
    const meetings: OneOnOneData[] = [];
    
    const agendaTemplates = [
      ['Career development', 'Q1 goals review', 'Team feedback'],
      ['Project updates', 'Resource needs', 'Professional growth'],
      ['Performance feedback', 'Skill development', 'Work-life balance'],
      ['Team collaboration', 'Process improvements', 'Career planning']
    ];
    
    const notesTemplates = [
      'Great discussion about career progression and skill development opportunities.',
      'Positive feedback on recent project contributions and team collaboration.',
      'Identified areas for improvement and created development plan.',
      'Discussed upcoming challenges and resource allocation needs.'
    ];

    // Generate meetings for some users
    let meetingId = 1;
    for (const user of users.slice(0, 8)) { // Limit to first 8 users
      const numMeetings = Math.floor(Math.random() * 3) + 1; // 1-3 meetings per user
      
      for (let i = 0; i < numMeetings; i++) {
        const isUpcoming = Math.random() > 0.6;
        const date = new Date();
        
        if (isUpcoming) {
          date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1);
        } else {
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        }
        
        const manager = users.find(u => u.position.includes('Manager') || u.position.includes('Lead'));
        const time = `${Math.floor(Math.random() * 8) + 9}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
        
        meetings.push({
          id: meetingId++,
          with: manager ? manager.name : 'Manager',
          date: date.toISOString().split('T')[0],
          time,
          agenda: agendaTemplates[Math.floor(Math.random() * agendaTemplates.length)],
          notes: notesTemplates[Math.floor(Math.random() * notesTemplates.length)],
          status: isUpcoming ? 'upcoming' : 'completed'
        });
      }
    }
    
    return meetings;
  } catch (error) {
    console.error('Error generating one-on-one data:', error);
    return [];
  }
};

// Cache for generated data to avoid repeated API calls
const dataCache = new Map<string, any>();

export const getCachedData = async <T>(key: string, generator: () => Promise<T>): Promise<T> => {
  if (dataCache.has(key)) {
    return dataCache.get(key);
  }
  
  const data = await generator();
  dataCache.set(key, data);
  
  // Clear cache after 5 minutes
  setTimeout(() => {
    dataCache.delete(key);
  }, 5 * 60 * 1000);
  
  return data;
};

// Export functions to get cached data
export const getFeedbackData = () => getCachedData('feedback', generateFeedbackData);
export const getShoutoutData = () => getCachedData('shoutouts', generateShoutoutData);
export const getGoalData = () => getCachedData('goals', generateGoalData);
export const getOneOnOneData = () => getCachedData('meetings', generateOneOnOneData);
