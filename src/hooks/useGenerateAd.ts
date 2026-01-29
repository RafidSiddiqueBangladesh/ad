import { useState } from "react";

interface GenerateAdParams {
  productName: string;
  productDescription: string;
  targetAudience?: string;
  platform?: string;
  tone?: string;
}

interface GenerateAdResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export const useGenerateAd = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const generateAd = async (params: GenerateAdParams): Promise<GenerateAdResponse> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/.netlify/functions/generate-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data: GenerateAdResponse = await response.json();

      if (data.success && data.content) {
        setResult(data.content);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    generateAd,
    loading,
    error,
    result,
  };
};
