import { useNavigate } from "react-router-dom";

// CSS custom properties for palette
const palette = {
  primary: "#7B9FE0",
  secondary: "#D4A5E0",
  accent: "#5FA899",
  background: "#F5F3F8",
  card: "#FFFFFF",
  text: "#1A1F3A",
  textSecondary: "#6B7280",
  feature1: "linear-gradient(135deg, #7B9FE0 0%, #A8C5E8 100%)",
  feature2: "linear-gradient(135deg, #D4A5E0 0%, #E8C5F0 100%)",
  feature3: "linear-gradient(135deg, #5FA899 0%, #8FC9B8 100%)",
  feature4: "linear-gradient(135deg, #E8A8B8 0%, #F0C5D0 100%)",
  feature5: "linear-gradient(135deg, #B8A5E0 0%, #D4C5F0 100%)",
  feature6: "linear-gradient(135deg, #6FB8A8 0%, #A0D4C8 100%)",
  studentTestimonial: "linear-gradient(135deg, #D4A5E0 0%, #E8C5F0 100%)",
  teacherTestimonial: "linear-gradient(135deg, #7B9FE0 0%, #A8C5E8 100%)",
  shadowLight: "0 2px 8px rgba(0,0,0,0.06)",
  shadowMedium: "0 4px 12px rgba(0,0,0,0.08)",
  shadowDark: "0 8px 16px rgba(0,0,0,0.10)",
};

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #F5F3F8 0%, #E8D5F2 100%)",
      }}
    >
      {/* Navigation Bar */}
      <header 
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-6 bg-white/95 rounded-b-2xl" 
        style={{ boxShadow: palette.shadowMedium }}
      >
        <div className="flex items-center gap-3">
          <span 
            className="rounded-full" 
            style={{ background: palette.secondary, padding: 8, boxShadow: palette.shadowLight }}
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#fff"/>
              <path d="M12 7v5l4 2" stroke={palette.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="font-extrabold text-2xl tracking-tight" style={{ color: palette.text }}>
            StudySync
          </span>
        </div>
        
        <nav className="flex items-center gap-8">
          <a 
            href="#features" 
            className="relative font-medium px-2 py-1 transition-colors duration-300" 
            style={{ color: palette.text }}
          >
            Features
          </a>
          <a 
            href="#about" 
            className="relative font-medium px-2 py-1 transition-colors duration-300" 
            style={{ color: palette.text }}
          >
            About
          </a>
          <button
            className="ml-4 px-7 py-2 rounded-full font-semibold text-white text-base focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300"
            style={{
              background: palette.secondary,
              boxShadow: palette.shadowLight,
              borderRadius: 24,
              color: '#fff',
              border: `1px solid ${palette.secondary}`,
            }}
            onClick={() => navigate("/login")}
            onFocus={(e) => e.currentTarget.style.outline = `2px solid ${palette.secondary}`}
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Abstract shapes */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl z-0 animate-pulse" 
          style={{ background: 'linear-gradient(135deg, #D4A5E0 0%, #E8D5F2 100%)', opacity: 0.5 }} 
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl z-0 animate-pulse" 
          style={{ background: 'linear-gradient(135deg, #7B9FE0 0%, #A8C5E8 100%)', opacity: 0.5 }} 
        />

        <span 
          className="inline-block px-5 py-1.5 rounded-full mb-7 text-base font-semibold shadow-md tracking-wide animate-fade-in-up" 
          style={{ background: palette.secondary, color: palette.text }}
        >
          Learn Smarter, Achieve More
        </span>
        
        <h1 className="text-5xl md:text-6xl font-extrabold mb-7 leading-tight animate-fade-in-up" style={{ color: palette.text }}>
          Transform Your <span style={{ color: palette.primary }}>Study</span> <span style={{ color: palette.secondary }}>Journey</span>
        </h1>
        
        <p className="max-w-2xl text-lg mb-12 animate-fade-in-up" style={{ color: palette.textSecondary }}>
          Where Teachers Guide & Students Excel. Connect, plan, and track your academic progress with our intelligent study planner.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 mb-14 animate-fade-in-up">
          <button
            className="px-10 py-3 font-semibold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300"
            style={{
              background: palette.secondary,
              color: '#fff',
              borderRadius: 24,
              boxShadow: palette.shadowLight,
              border: `1px solid ${palette.secondary}`,
              filter: 'brightness(1)',
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            onClick={() => navigate("/login?role=student")}
          >
            I'm a Student
          </button>
          
          <button
            className="px-10 py-3 font-semibold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300"
            style={{
              background: palette.primary,
              color: '#fff',
              borderRadius: 24,
              boxShadow: palette.shadowLight,
              border: `1px solid ${palette.primary}`,
              filter: 'brightness(1)',
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            onClick={() => navigate("/login?role=teacher")}
          >
            I'm a Teacher
          </button>
        </div>

        {/* Statistics Section */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-8 animate-fade-in-up">
          <div className="rounded-2xl px-8 py-6 flex flex-col items-center min-w-[120px]" style={{ background: palette.card, boxShadow: palette.shadowLight, borderRadius: 16 }}>
            <div className="text-3xl font-extrabold mb-1" style={{ color: palette.primary }}>10K+</div>
            <div className="text-sm" style={{ color: palette.textSecondary }}>Students</div>
          </div>
          
          <div className="rounded-2xl px-8 py-6 flex flex-col items-center min-w-[120px]" style={{ background: palette.card, boxShadow: palette.shadowLight, borderRadius: 16 }}>
            <div className="text-3xl font-extrabold mb-1" style={{ color: palette.accent }}>500+</div>
            <div className="text-sm" style={{ color: palette.textSecondary }}>Teachers</div>
          </div>
          
          <div className="rounded-2xl px-8 py-6 flex flex-col items-center min-w-[120px]" style={{ background: palette.card, boxShadow: palette.shadowLight, borderRadius: 16 }}>
            <div className="text-3xl font-extrabold mb-1" style={{ color: palette.secondary }}>50K+</div>
            <div className="text-sm" style={{ color: palette.textSecondary }}>Tasks Done</div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="w-full max-w-6xl mx-auto mt-20 px-4 scroll-mt-28" style={{ scrollMarginTop: '112px' }}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center tracking-tight">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div 
              className="p-7 flex flex-col items-start transition-all duration-300" 
              style={{ background: palette.feature1, borderRadius: 16, boxShadow: palette.shadowMedium, color: '#fff', transform: 'scale(1)', cursor: 'pointer' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="bg-white/20 rounded-full p-3 mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M4 19h16M4 19l4-4m8 4l-4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Live Lessons</h3>
              <p className="mb-2">Attend interactive live classes, ask questions in real-time, and collaborate with peers and teachers.</p>
              <span className="inline-block bg-[#A8C5E8] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
                Real-time
              </span>
            </div>

            {/* Feature Card 2 */}
            <div 
              className="p-7 flex flex-col items-start transition-all duration-300" 
              style={{ background: palette.feature2, borderRadius: 16, boxShadow: palette.shadowMedium, color: '#fff', transform: 'scale(1)', cursor: 'pointer' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="bg-white/20 rounded-full p-3 mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="mb-2">Visualize your learning journey, monitor completed lessons, and maintain study streaks for motivation.</p>
              <span className="inline-block bg-[#E8C5F0] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
                Analytics
              </span>
            </div>

            {/* Feature Card 3 */}
            <div 
              className="p-7 flex flex-col items-start transition-all duration-300" 
              style={{ background: palette.feature3, borderRadius: 16, boxShadow: palette.shadowMedium, color: '#fff', transform: 'scale(1)', cursor: 'pointer' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="bg-white/20 rounded-full p-3 mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M8 12h8m-4-4v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Doubt Solver</h3>
              <p className="mb-2">Instantly get your academic doubts resolved by teachers or AI, anytime you need help.</p>
              <span className="inline-block bg-[#8FC9B8] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
                AI & Human
              </span>
            </div>

            {/* Feature Card 4 */}
            <div 
              className="p-7 flex flex-col items-start transition-all duration-300" 
              style={{ background: palette.feature4, borderRadius: 16, boxShadow: palette.shadowMedium, color: '#fff', transform: 'scale(1)', cursor: 'pointer' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="bg-white/20 rounded-full p-3 mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M4 17v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Study Groups</h3>
              <p className="mb-2">Join or create study groups, collaborate on assignments, and learn together with friends.</p>
              <span className="inline-block bg-[#F0C5D0] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
                Community
              </span>
            </div>

            {/* Feature Card 5 */}
            <div 
              className="p-7 flex flex-col items-start transition-all duration-300" 
              style={{ background: palette.feature5, borderRadius: 16, boxShadow: palette.shadowMedium, color: '#fff', transform: 'scale(1)', cursor: 'pointer' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="bg-white/20 rounded-full p-3 mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M6 18V6a2 2 0 012-2h8a2 2 0 012 2v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="6" y="18" width="12" height="2" rx="1" fill="#fff"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Assignments & Tasks</h3>
              <p className="mb-2">Manage assignments, set deadlines, and track your to-dos with reminders and notifications.</p>
              <span className="inline-block bg-[#D4C5F0] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
                Productivity
              </span>
            </div>

            {/* Feature Card 6 */}
            <div 
              className="p-7 flex flex-col items-start transition-all duration-300" 
              style={{ background: palette.feature6, borderRadius: 16, boxShadow: palette.shadowMedium, color: '#fff', transform: 'scale(1)', cursor: 'pointer' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="bg-white/20 rounded-full p-3 mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M12 20v-6m0 0V4m0 10l3-3m-3 3l-3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Recorded Lessons</h3>
              <p className="mb-2">Access a library of recorded lessons anytime, anywhere, and learn at your own pace.</p>
              <span className="inline-block bg-[#A0D4C8] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
                On Demand
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full max-w-5xl mx-auto mt-24 mb-20 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center tracking-tight">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial 1 (Student) */}
          <div 
            className="rounded-2xl p-8 flex flex-col items-start transition-all duration-300" 
            style={{ background: palette.studentTestimonial, boxShadow: palette.shadowMedium, color: '#fff', borderRadius: 16, transform: 'scale(1)', cursor: 'pointer' }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className="flex items-center gap-4 mb-4">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Student" className="w-12 h-12 rounded-full border-2 border-[#E8C5F0]" />
              <div>
                <div className="font-bold text-white">Aman Sharma</div>
                <div className="text-xs text-[#F5F3F8]">Student, Grade 11</div>
              </div>
            </div>
            <p className="text-white/90 text-lg mb-2">"StudySync has made learning so much more fun and organized. The live lessons and doubt solver are my favorite!"</p>
            <span className="inline-block bg-[#E8C5F0] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
              Student
            </span>
          </div>

          {/* Testimonial 2 (Teacher) */}
          <div 
            className="rounded-2xl p-8 flex flex-col items-start transition-all duration-300" 
            style={{ background: palette.teacherTestimonial, boxShadow: palette.shadowMedium, color: '#fff', borderRadius: 16, transform: 'scale(1)', cursor: 'pointer' }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className="flex items-center gap-4 mb-4">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Teacher" className="w-12 h-12 rounded-full border-2 border-[#A8C5E8]" />
              <div>
                <div className="font-bold text-white">Priya Verma</div>
                <div className="text-xs text-[#F5F3F8]">Teacher, Mathematics</div>
              </div>
            </div>
            <p className="text-white/90 text-lg mb-2">"The dashboard helps me track every student's progress and the assignments feature saves me hours every week!"</p>
            <span className="inline-block bg-[#A8C5E8] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
              Teacher
            </span>
          </div>

          {/* Testimonial 3 (Student) */}
          <div 
            className="rounded-2xl p-8 flex flex-col items-start transition-all duration-300" 
            style={{ background: palette.studentTestimonial, boxShadow: palette.shadowMedium, color: '#fff', borderRadius: 16, transform: 'scale(1)', cursor: 'pointer' }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className="flex items-center gap-4 mb-4">
              <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Student" className="w-12 h-12 rounded-full border-2 border-[#E8C5F0]" />
              <div>
                <div className="font-bold text-white">Rahul Mehta</div>
                <div className="text-xs text-[#F5F3F8]">Student, Grade 12</div>
              </div>
            </div>
            <p className="text-white/90 text-lg mb-2">"Assignments and reminders keep me on track. I love the group study feature!"</p>
            <span className="inline-block bg-[#E8C5F0] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
              Student
            </span>
          </div>

          {/* Testimonial 4 (Teacher) */}
          <div 
            className="rounded-2xl p-8 flex flex-col items-start transition-all duration-300" 
            style={{ background: palette.teacherTestimonial, boxShadow: palette.shadowMedium, color: '#fff', borderRadius: 16, transform: 'scale(1)', cursor: 'pointer' }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className="flex items-center gap-4 mb-4">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Teacher" className="w-12 h-12 rounded-full border-2 border-[#A8C5E8]" />
              <div>
                <div className="font-bold text-white">Meena Joshi</div>
                <div className="text-xs text-[#F5F3F8]">Teacher, Science</div>
              </div>
            </div>
            <p className="text-white/90 text-lg mb-2">"StudySync's analytics and progress tracking help me personalize my teaching for every student."</p>
            <span className="inline-block bg-[#A8C5E8] text-[#1A1F3A] text-xs font-semibold px-3 py-1 rounded-full mt-auto">
              Teacher
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}