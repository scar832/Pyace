export const mockReports = {
  overallStats: {
    gpa: "3.8/4.0",
    totalAssignments: 42,
    pendingGrades: 3,
    classRank: "Top 15%"
  },
  skillBreakdown: [
    { topic: "Python Syntax", score: 95 },
    { topic: "Data Structures", score: 82 },
    { topic: "Object-Oriented Programming (OOP)", score: 78 },
    { topic: "Algorithms", score: 88 },
    { topic: "File Handling", score: 92 }
  ],
  aiInsights: {
    identifiedWeakness: "You've been struggling slightly with class inheritance and polymorphism in OOP, particularly when overriding base class methods.",
    recommendedImprovement: "Review the concepts of super() and method resolution order (MRO). Practice creating a multi-level inheritance structure.",
    suggestedChallenge: "Build a Zoo Animal Class Factory"
  },
  classReports: [
    {
      id: "cs101",
      className: "CS101: Intro to Computer Science",
      overallGrade: "A-",
      pastReports: [
        { id: 1, title: "Variables & Loops", date: "2026-03-10", score: 95, maxScore: 100, teacherNotes: "Excellent logical flow. Try to use more descriptive variable names next time." },
        { id: 2, title: "List Comprehensions", date: "2026-03-24", score: 88, maxScore: 100, teacherNotes: "Good work, but you missed handling the edge case for empty lists." }
      ],
      pendingReports: [
        { id: 3, title: "Midterm Project: Calculator", submittedDate: "2026-04-15" }
      ]
    },
    {
      id: "cs202",
      className: "CS202: Data Structures",
      overallGrade: "B+",
      pastReports: [
        { id: 4, title: "Binary Search Trees", date: "2026-04-01", score: 82, maxScore: 100, teacherNotes: "Your traversal method has a small logic error on line 45, leading to incorrect post-order output." },
        { id: 5, title: "Hash Maps Implementation", date: "2026-04-10", score: 89, maxScore: 100, teacherNotes: "Great handling of collisions, but your resizing logic is slightly inefficient when crossing the load factor." }
      ],
      pendingReports: [
        { id: 6, title: "Graph Algorithms", submittedDate: "2026-04-17" },
        { id: 7, title: "Dijkstra's Algorithm Quiz", submittedDate: "2026-04-18" }
      ]
    }
  ]
};
