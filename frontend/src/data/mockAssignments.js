export const mockAssignments = [
  {
    id: '1',
    title: 'Graph Traversal Implementation',
    className: 'Advanced Data Structures',
    courseCode: 'CS 301',
    dueDate: new Date().toISOString(),
    status: 'pending',
    type: 'code',
    isGroup: false,
    accent: '#0061ff',
    estimatedTime: '4 Hours',
    description: 'Implement BFS and DFS graph traversal algorithms in Python. Ensure that your graph handles disconnected components.',
    objectives: [
      { id: '1-1', text: 'Implement iterative BFS', completed: true },
      { id: '1-2', text: 'Implement iterative DFS', completed: false },
      { id: '1-3', text: 'Write 3 test cases for disconnected graphs', completed: false },
    ],
    rubric: [
      { criteria: 'Correctness (BFS/DFS logic)', points: 40 },
      { criteria: 'Code Cleanliness & Documentation', points: 30 },
      { criteria: 'Handling Edge Cases', points: 30 }
    ],
    timeline: [
      { step: 'Assigned', status: 'complete' },
      { step: 'In Progress', status: 'active' },
      { step: 'Submitted', status: 'pending' },
      { step: 'Graded', status: 'pending' }
    ]
  },
  {
    id: '2',
    title: 'Accessibility Audit Report',
    className: 'User Interface Engineering',
    courseCode: 'SE 210',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'pending',
    type: 'objective',
    isGroup: true,
    groupDetails: {
      teamName: 'Team Alpha',
      members: ['Alice Johnson', 'Bob Smith', 'Charlie Lee']
    },
    accent: '#10b981',
    estimatedTime: '2 Days',
    description: 'Conduct a thorough WCAG accessibility audit for a modern dynamic web application. Submit a comprehensive markdown report listing violations and proposed fixes.',
    objectives: [
      { id: '2-1', text: 'Initial automated Lighthouse scan', completed: true },
      { id: '2-2', text: 'Manual keyboard navigation audit', completed: false },
      { id: '2-3', text: 'Screen reader compatibility check', completed: false },
      { id: '2-4', text: 'Finalize markdown report', completed: false },
    ],
    rubric: [
      { criteria: 'Audit Thoroughness', points: 50 },
      { criteria: 'Quality of Proposed Fixes', points: 30 },
      { criteria: 'Formatting & Presentation', points: 20 }
    ],
    timeline: [
      { step: 'Assigned', status: 'complete' },
      { step: 'Planning', status: 'complete' },
      { step: 'Auditing', status: 'active' },
      { step: 'Submitted', status: 'pending' }
    ]
  },
  {
    id: '3',
    title: 'Minimax Agent',
    className: 'Artificial Intelligence',
    courseCode: 'CS 450',
    dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'overdue',
    type: 'code',
    isGroup: false,
    accent: '#8b5cf6',
    estimatedTime: '8 Hours',
    description: 'Build a game agent capable of playing Tic-Tac-Toe optimally using the Minimax algorithm with alpha-beta pruning.',
    objectives: [
      { id: '3-1', text: 'Develop basic game loop', completed: true },
      { id: '3-2', text: 'Implement Minimax evaluation function', completed: true },
      { id: '3-3', text: 'Add alpha-beta pruning for optimization', completed: false },
    ],
    rubric: [
      { criteria: 'Algorithm Accuracy', points: 45 },
      { criteria: 'Pruning Efficiency', points: 35 },
      { criteria: 'Game Loop Integration', points: 20 }
    ],
    timeline: [
      { step: 'Assigned', status: 'complete' },
      { step: 'In Progress', status: 'active' },
      { step: 'Late Submission', status: 'pending' }
    ]
  },
  {
    id: '4',
    title: 'Modern Web Architecture Final',
    className: 'Modern Web Architecture',
    courseCode: 'SE 305',
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    status: 'pending',
    type: 'objective',
    isGroup: true,
    groupDetails: {
      teamName: 'Team Beta',
      members: ['David Kim', 'Emma Watson', 'Frank Castle']
    },
    accent: '#f59e0b',
    estimatedTime: '2 Weeks',
    description: 'Design and deploy a scalable microservices architecture. Present the architecture diagram and document the communication patterns.',
    objectives: [
      { id: '4-1', text: 'Design RESTful API schemas', completed: true },
      { id: '4-2', text: 'Setup Docker Compose for local development', completed: false },
      { id: '4-3', text: 'Draft system architecture diagram', completed: false },
    ],
    rubric: [
      { criteria: 'Architecture Soundness', points: 40 },
      { criteria: 'Documentation Clarity', points: 40 },
      { criteria: 'Docker Configurations', points: 20 }
    ],
    timeline: [
      { step: 'Assigned', status: 'complete' },
      { step: 'Drafting', status: 'active' },
      { step: 'Review', status: 'pending' },
      { step: 'Final Polish', status: 'pending' }
    ]
  }
];
