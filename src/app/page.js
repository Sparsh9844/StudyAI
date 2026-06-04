'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  Menu, X, Sparkles, ArrowRight, Check, Star, ChevronDown,
  BrainCircuit, CalendarRange, BarChart3, RefreshCw, Bot, Shield,
  GraduationCap, Target, Zap, BookOpen, TrendingUp, Layers,
} from 'lucide-react'

/* ─────────────────────── COMPONENTS ─────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))
  }, [])

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-black/70 backdrop-blur-2xl border-b border-white/[0.04] shadow-xl shadow-black/20'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">StudyFlow AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >{l.label}</a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login"
                  className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >Sign In</Link>
                <Link href="/auth/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
                >Get Started Free</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-gray-400 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-5 pt-2 space-y-3 bg-black/90 backdrop-blur-2xl border-t border-white/[0.04]">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="block text-gray-300 hover:text-white text-sm font-medium py-2 transition-colors"
            >{l.label}</a>
          ))}
          <div className="pt-3 border-t border-white/[0.06] space-y-3">
            {user ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium"
              >Dashboard</Link>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-5 py-3 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5"
                >Sign In</Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium"
                >Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative py-20 lg:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

function SectionHeading({ label, title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-18 space-y-3">
      <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
        {label}
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-gray-400 text-base lg:text-lg">{subtitle}</p>}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <div className="group glass rounded-2xl p-6 lg:p-7 glass-hover gradient-border">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} p-2.5 mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="w-full h-full text-white" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="relative flex gap-5 lg:flex-col lg:text-center lg:items-center lg:gap-4">
      {/* Connector line (desktop) */}
      <div className="hidden lg:block absolute top-10 left-[calc(50%+28px)] w-full h-px bg-gradient-to-r from-indigo-500/40 to-transparent" />
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 relative z-10">
        {number}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ name, role, content, rating = 5 }) {
  return (
    <div className="glass rounded-2xl p-6 flex-shrink-0 w-[320px] lg:w-[380px] gradient-border">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{content}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{name}</p>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ question, answer, open, onToggle }) {
  return (
    <div className={`glass rounded-2xl transition-all duration-300 ${open ? 'border-indigo-500/20' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 lg:p-6 text-left"
      >
        <span className="text-white font-medium text-sm lg:text-base pr-4">{question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5 lg:pb-6 px-5 lg:px-6' : 'max-h-0'}`}>
        <p className="text-gray-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

/* ─────────────────────── PAGE ─────────────────────── */

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null)

  const features = [
    { icon: BrainCircuit, title: 'AI Study Plans', description: 'Generate personalized day-wise study schedules powered by Groq AI, optimized for your subjects and exam dates.', gradient: 'from-violet-500 to-purple-500' },
    { icon: Layers, title: 'Topic Management', description: 'Organize subjects and topics with drag-and-drop. Track status: Pending, In Progress, or Completed at a glance.', gradient: 'from-blue-500 to-cyan-500' },
    { icon: RefreshCw, title: 'Revision System', description: 'Master the 3-revision cycle. Mark topics for Revision 1, 2, and 3 with smart spaced repetition reminders.', gradient: 'from-emerald-500 to-teal-500' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Visualize your progress with bar, line, and doughnut charts. Track completion rates and identify weak areas.', gradient: 'from-amber-500 to-orange-500' },
    { icon: Bot, title: 'AI Assistant', description: 'Chat with an intelligent tutor. Generate notes, solve doubts, get explanations, and receive personalized study tips.', gradient: 'from-pink-500 to-rose-500' },
    { icon: Shield, title: 'Export & Share', description: 'Export study plans and progress reports to PDF or CSV. Share your schedule with friends or print it out.', gradient: 'from-indigo-500 to-purple-500' },
  ]

  const steps = [
    { number: '01', title: 'Add Your Subjects', description: 'Create subjects with exam dates. Add topics under each subject and set their current status.' },
    { number: '02', title: 'Generate AI Plan', description: 'Let our AI create a personalized day-wise study schedule based on your subjects and available time.' },
    { number: '03', title: 'Study & Track', description: 'Follow your plan, mark topics as you go, and check off completed work to see your progress grow.' },
    { number: '04', title: 'Revise & Master', description: 'Use the 3-revision system to reinforce learning. Track each revision cycle until exam day.' },
  ]

  const testimonials = [
    { name: 'Priya Sharma', role: 'Medical Student', content: 'StudyFlow AI completely transformed my exam prep. The AI-generated plan saved me hours of planning and the revision tracker ensured I never missed a topic.', rating: 5 },
    { name: 'Rahul Verma', role: 'Engineering Student', content: 'The analytics dashboard helped me identify which subjects needed more attention. My grades improved by 40% in one semester!', rating: 5 },
    { name: 'Ananya Patel', role: 'Law Student', content: 'I was overwhelmed with the syllabus until I found StudyFlow. The AI assistant helped me break down complex topics into manageable study sessions.', rating: 5 },
    { name: 'Arjun Mehta', role: 'High School Student', content: 'The 3-revision system is a game-changer. I used to forget topics after a week, but now I retain everything until exams.', rating: 5 },
    { name: 'Neha Gupta', role: 'Competitive Exam Prep', content: 'Preparing for UPSC was daunting, but StudyFlow made it manageable. The daily study plans kept me on track for 8 months straight.', rating: 5 },
    { name: 'Vikram Singh', role: 'MBA Student', content: 'Exporting my study plan to PDF and sharing it with my study group was incredibly useful. Highly recommended for group study coordination.', rating: 5 },
  ]

  const faqs = [
    { question: 'How does the AI study plan work?', answer: 'Our AI analyzes your subjects, exam dates, and available time to create a personalized day-wise study schedule. It prioritizes topics based on exam proximity and difficulty, ensuring optimal coverage of your syllabus.' },
    { question: 'Is StudyFlow AI free to use?', answer: 'Yes! StudyFlow AI offers a generous free tier with access to core features including subject management, topic tracking, and AI study plan generation. Premium features like advanced analytics and unlimited AI chat are available on our Pro plan.' },
    { question: 'Can I track multiple subjects at once?', answer: 'Absolutely! You can add unlimited subjects, each with its own set of topics and exam dates. The dashboard gives you a bird\'s-eye view of all your subjects and overall progress.' },
    { question: 'How does the revision tracking work?', answer: 'The 3-revision system is based on spaced repetition research. After studying a topic, mark it for Revision 1. After a gap, do Revision 2, then Revision 3. Each revision strengthens long-term memory retention.' },
    { question: 'Can I export my study plan?', answer: 'Yes, you can export your study plan and progress data to PDF or CSV format. This is perfect for printing, sharing with study groups, or keeping offline backups.' },
    { question: 'What subjects and exams does it support?', answer: 'StudyFlow AI works with any subject or exam type - from school exams and college courses to competitive exams like UPSC, JEE, NEET, GMAT, GRE, and professional certifications.' },
  ]

  return (
    <div className="mesh-bg min-h-screen">

      {/* ── Animated background blobs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] animate-blob" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] animate-blob-delay" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-pink-500/5 blur-[150px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left */}
            <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-7 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium animate-fade-in-up">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Study Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.1] animate-fade-in-up delay-100">
                Plan Smarter.<br />
                <span className="gradient-text">Revise Better.</span><br />
                Score Higher.
              </h1>
              <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 animate-fade-in-up delay-200">
                StudyFlow AI creates personalized study plans, tracks your revision progress, 
                and helps you ace your exams with AI-powered tools.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start animate-fade-in-up delay-300">
                <Link
                  href="/auth/register"
                  className="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all inline-flex items-center justify-center gap-2"
                >
                  Start Studying Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/5 hover:text-white transition-all text-center"
                >
                  See Features
                </a>
              </div>
              {/* Trust bar */}
              <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-gray-500 pt-4 animate-fade-in-up delay-400">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" />
                  No credit card
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Free forever
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" />
                  AI-powered
                </div>
              </div>
            </div>

            {/* Right - Mockup */}
            <div className="flex-1 relative z-10 animate-fade-in-up delay-500 w-full max-w-lg lg:max-w-none">
              <div className="relative">
                {/* Glow behind */}
                <div className="absolute -inset-10 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-3xl" />
                <div className="relative glass rounded-2xl p-4 lg:p-6 shadow-2xl overflow-hidden">
                  <div className="bg-grid absolute inset-0 opacity-50" />
                  <div className="relative">
                    {/* Mockup header */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                      <div className="ml-3 text-xs text-gray-500 font-mono">StudyFlow AI — Dashboard</div>
                    </div>
                    {/* Mockup content */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">Mathematics</div>
                            <div className="text-gray-600 text-xs">12 topics • 3 exams</div>
                          </div>
                        </div>
                        <div className="text-emerald-400 text-sm font-semibold">82%</div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {['Pending', 'In Progress', 'Completed'].map((s, i) => (
                          <div key={s} className="text-center p-2 rounded-lg bg-white/[0.03]">
                            <div className={`text-xs font-bold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-blue-400' : 'text-emerald-400'}`}>
                              {[4, 3, 5][i]}
                            </div>
                            <div className="text-gray-600 text-[10px]">{s}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <Section id="features">
        <SectionHeading
          label="Features"
          title="Everything You Need to Ace Your Exams"
          subtitle="AI-powered tools designed to optimize your study routine and boost retention."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((f, i) => (
            <div key={f.title} className={`animate-fade-in-up delay-${(i % 6 + 1) * 100}`}>
              <FeatureCard {...f} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section id="how-it-works">
        <SectionHeading
          label="How It Works"
          title="Get Started in 4 Simple Steps"
          subtitle="From setup to success — here's how StudyFlow AI helps you study smarter."
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 relative">
          {steps.map((s, i) => (
            <div key={s.number} className={`animate-fade-in-up delay-${(i + 1) * 100}`}>
              <StepCard {...s} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section id="testimonials">
        <SectionHeading
          label="Testimonials"
          title="Loved by Students Everywhere"
          subtitle="Join thousands of students who transformed their study habits with StudyFlow AI."
        />
        <div className="relative overflow-hidden">
          <div className="flex gap-4 animate-scroll hover:pause">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section id="faq">
        <SectionHeading
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about StudyFlow AI."
        />
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className={`animate-fade-in-up delay-${(i + 1) * 100}`}>
              <FaqItem
                {...faq}
                open={faqOpen === i}
                onToggle={() => setFaqOpen(faqOpen === i ? null : i)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA SECTION ── */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl p-10 lg:p-16 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 border border-white/[0.06] text-center">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Ready to <span className="gradient-text">Study Smarter</span>?
              </h2>
              <p className="text-gray-400 text-base lg:text-lg">
                Join thousands of students using StudyFlow AI to plan, revise, and ace their exams. Start free — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/auth/register"
                  className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all inline-flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="px-8 py-3.5 rounded-xl border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/5 hover:text-white transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.04] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">StudyFlow AI</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                AI-powered study platform that helps you plan smarter, revise better, and score higher.
              </p>
            </div>
            {/* Product */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2.5">
                {['Features', 'How It Works', 'Pricing', 'FAQ'].map(item => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5">
                {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                  <li key={item}>
                    <span className="text-gray-500 text-sm cursor-not-allowed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {['Privacy', 'Terms', 'Security', 'Cookies'].map(item => (
                  <li key={item}>
                    <span className="text-gray-500 text-sm cursor-not-allowed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} StudyFlow AI. All rights reserved.</p>
            <div className="flex items-center gap-4 text-gray-500 text-xs">
              <span>Built with ❤️ for students everywhere</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
