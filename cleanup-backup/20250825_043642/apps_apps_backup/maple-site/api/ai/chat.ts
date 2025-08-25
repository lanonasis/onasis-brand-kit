import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, language = 'en' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Use Perplexity API directly
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online', // Cheaper model
        messages: messages,
        max_tokens: 200, // Keep responses concise
        temperature: 0.3,
        top_p: 0.9,
        return_citations: false,
        search_domain_filter: ["lanonasis.com", "maplehub.lanonasis.com"],
        search_recency_filter: "month",
        stream: false
      })
    });

    if (!perplexityResponse.ok) {
      throw new Error(`Perplexity API error: ${perplexityResponse.status}`);
    }

    const data = await perplexityResponse.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm here to help with any questions about Maple Wealth or Maple Sport!";
    
    return res.status(200).json({
      response: aiResponse,
      language: language
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    // Fallback response
    const fallbackResponses = {
      en: "I'm experiencing some technical difficulties. Please try again or contact our support team for immediate assistance.",
      es: "Estoy experimentando algunas dificultades técnicas. Por favor inténtalo de nuevo o contacta a nuestro equipo de soporte.",
      fr: "Je rencontre des difficultés techniques. Veuillez réessayer ou contacter notre équipe de support.",
      de: "Ich habe technische Schwierigkeiten. Bitte versuchen Sie es erneut oder kontaktieren Sie unser Support-Team.",
      ja: "技術的な問題が発生しています。もう一度お試しいただくか、サポートチームにお問い合わせください。",
      zh: "我遇到了一些技术困难。请重试或联系我们的支持团队。",
      pt: "Estou enfrentando algumas dificuldades técnicas. Tente novamente ou entre em contato com nossa equipe de suporte.",
      ar: "أواجه بعض الصعوبات التقنية. يرجى المحاولة مرة أخرى أو الاتصال بفريق الدعم لدينا.",
      ko: "기술적인 문제가 발생했습니다. 다시 시도하거나 지원팀에 문의해 주세요.",
      it: "Sto riscontrando alcune difficoltà tecniche. Riprova o contatta il nostro team di supporto.",
      ru: "У меня возникли технические трудности. Пожалуйста, попробуйте снова или обратитесь к нашей службе поддержки."
    };

    const fallbackMessage = fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en;

    return res.status(500).json({
      response: fallbackMessage,
      error: 'AI service temporarily unavailable'
    });
  }
}