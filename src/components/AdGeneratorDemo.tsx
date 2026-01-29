import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const platforms = [
  { value: "google", label: "Google Search Ads" },
  { value: "facebook", label: "Facebook / Instagram" },
  { value: "tiktok", label: "TikTok Ads" },
  { value: "youtube", label: "YouTube Ads" },
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual & Friendly" },
  { value: "urgent", label: "Urgency-Driven" },
  { value: "luxury", label: "Premium / Luxury" },
  { value: "playful", label: "Playful & Fun" },
];

export const AdGeneratorDemo = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    targetAudience: "",
    platform: "facebook",
    tone: "professional",
  });

  const handleGenerate = async () => {
    if (!formData.productName || !formData.productDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the product name and description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedAd("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate ad");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              setGeneratedAd((prev) => prev + content);
            }
          } catch {
            // Partial JSON, skip
          }
        }
      }

      toast({
        title: "Ad Generated!",
        description: "Your AI-powered ad copy is ready.",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedAd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Ad copy copied to clipboard." });
  };

  return (
    <section id="demo" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">
            Live Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Try the <span className="text-gradient">AI Ad Generator</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enter your product details and watch AI create high-converting ad copy in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Product Details
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Product / Service Name
                </label>
                <Input
                  placeholder="e.g., FitTrack Pro Smartwatch"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  className="bg-background/50 border-border"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Description
                </label>
                <Textarea
                  placeholder="Describe your product, key features, and benefits..."
                  value={formData.productDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, productDescription: e.target.value })
                  }
                  className="bg-background/50 border-border min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Target Audience
                </label>
                <Input
                  placeholder="e.g., Fitness enthusiasts aged 25-45"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Platform
                  </label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) =>
                      setFormData({ ...formData, platform: value })
                    }
                  >
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Tone
                  </label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tone: value })
                    }
                  >
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full mt-4"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Ad Copy
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Generated Ad Copy</h3>
              {generatedAd && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>

            <div className="flex-1 bg-background/50 rounded-xl p-6 border border-border overflow-auto min-h-[400px]">
              {isGenerating && !generatedAd && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI is crafting your ad copy...</span>
                </div>
              )}

              {generatedAd ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                    {generatedAd}
                  </pre>
                </div>
              ) : (
                !isGenerating && (
                  <p className="text-muted-foreground text-center mt-20">
                    Your AI-generated ad copy will appear here...
                  </p>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
