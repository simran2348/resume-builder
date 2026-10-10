// Example data shown in every template on the templates screen so they're easy to compare.
export const SAMPLE_RESUME = {
  personal: {
    fullName: "John Doe",
    jobTitle: "Senior Software Engineer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    website: "",
    photo: "",
  },
  summary:
    "Senior software engineer with 7+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean architecture, performance and mentoring, with a proven record of shipping products used by millions.",
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Acme Corp",
      location: "San Francisco, CA",
      startDate: "Mar 2021",
      endDate: "Present",
      bullets: [
        "Led a team of 5 engineers to rebuild the checkout flow, increasing conversion by 18%.",
        "Cut page load time by 40% through code splitting, caching and image optimisation.",
        "Introduced code review guidelines and mentored 4 junior developers.",
      ],
    },
    {
      role: "Software Engineer",
      company: "Globex Inc",
      location: "Austin, TX",
      startDate: "Jun 2017",
      endDate: "Feb 2021",
      bullets: [
        "Built a real-time analytics dashboard used by 200+ enterprise clients.",
        "Migrated legacy services to a microservices architecture on AWS.",
        "Raised automated test coverage from 45% to 85%.",
      ],
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      school: "University of Texas at Austin",
      location: "Austin, TX",
      startDate: "2013",
      endDate: "2017",
      grade: "GPA 3.8 / 4.0",
    },
  ],
  projects: [
    {
      name: "Open-source design system",
      role: "Creator & maintainer",
      link: "github.com/johndoe/ui-kit",
      startDate: "2022",
      endDate: "Present",
      description: "Accessible React component library with 40+ components, used by 3,000+ developers.",
    },
  ],
  achievements: [
    {
      title: "Engineering Excellence Award, Acme Corp",
      date: "2023",
      description: "Recognised for leading the checkout rebuild that lifted conversion by 18%.",
    },
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2022" },
  ],
  hobbies: ["Rock climbing", "Photography", "Chess"],
  skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "AWS", "Docker"],
  // Shown by "Grouped skills" templates.
  skillGroups: [
    { name: "Frontend", items: ["JavaScript", "TypeScript", "React", "Next.js"] },
    { name: "Backend", items: ["Node.js", "PostgreSQL"] },
    { name: "Cloud & DevOps", items: ["AWS", "Docker"] },
  ],
  // `level` is 1–5 and drives the proficiency bars in some templates.
  languages: [
    { name: "English", proficiency: "Native", level: 5 },
    { name: "Spanish", proficiency: "Intermediate", level: 3 },
  ],
};
