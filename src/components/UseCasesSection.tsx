import { motion } from "framer-motion";
import { Rocket, ShoppingBag, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const useCases = [
  {
    icon: Rocket,
    title: "Startups",
    description:
      "Launch your brand with AI-generated ads that compete with enterprise budgets. Scale fast without a marketing team.",
    benefits: ["Instant ad creation", "Budget-smart optimization", "Rapid A/B testing"],
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description:
      "Turn products into scroll-stopping video ads. Sync inventory and automate seasonal campaigns.",
    benefits: ["Product video automation", "Dynamic retargeting", "Conversion tracking"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MapPin,
    title: "Local Business",
    description:
      "Reach customers in your area with hyper-local targeting. Drive foot traffic and bookings.",
    benefits: ["Geo-targeted ads", "Review integration", "Booking CTAs"],
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
  {
    icon: Building2,
    title: "Agencies",
    description:
      "Manage multiple clients from one dashboard. White-label reporting and team collaboration built-in.",
    benefits: ["Multi-client dashboard", "White-label reports", "Team permissions"],
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
];

export const UseCasesSection = () => {
  return (
    <section id="use-cases" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">
            Use Cases
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Built for <span className="text-gradient">Every Business</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a solo founder or managing 100 clients, AdGenix adapts to your workflow.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-8 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-xl ${useCase.bgColor} shrink-0`}>
                  <useCase.icon className={`w-8 h-8 ${useCase.color}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${useCase.color.replace('text-', 'bg-')}`} />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="hero" size="lg">
            See How It Works for You
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
