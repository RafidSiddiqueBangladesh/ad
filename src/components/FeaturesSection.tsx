import { motion } from "framer-motion";
import { Video, FileText, BarChart2, Settings2, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "AI Video Generator",
    description:
      "Auto-generate short marketing videos from product info. Optimized for Reels, Shorts, TikTok & YouTube Ads.",
    gradient: "from-primary to-purple-400",
  },
  {
    icon: FileText,
    title: "AI Ad Copy Generator",
    description:
      "Create high-converting copy for Google Search Ads, Facebook & Instagram with A/B testing suggestions.",
    gradient: "from-accent to-teal-400",
  },
  {
    icon: BarChart2,
    title: "Performance Tracking",
    description:
      "Connect Google Ads, Facebook & Instagram. Track impressions, CTR, CPC, conversions & ROAS in real-time.",
    gradient: "from-orange-400 to-pink-500",
  },
  {
    icon: Settings2,
    title: "Smart Optimization",
    description:
      "AI-powered budget allocation, audience targeting improvements, and best time recommendations.",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    icon: Users,
    title: "Collaboration Hub",
    description:
      "Brand ↔ creator dashboard with campaign briefs, approvals, messaging, and influencer tracking.",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description:
      "Get AI-powered recommendations on what's working and what needs improvement across all campaigns.",
    gradient: "from-yellow-400 to-orange-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Dominate</span> Digital Ads
          </h2>
          <p className="text-lg text-muted-foreground">
            From AI-generated content to real-time analytics—one platform for all your 
            marketing needs.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-glow hover:border-primary/30">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-background" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
