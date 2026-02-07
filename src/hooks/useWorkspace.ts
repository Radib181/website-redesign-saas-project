import { useState, useCallback, useRef, useEffect } from 'react';
import { WorkspaceState, ChatMessage, WEBHOOKS } from '@/types/project';

const WEBHOOK_BASE_URL = 'https://n8n.yourdomain.com/webhook/';

interface UseWorkspaceProps {
  onCodeUpdate: (code: string, isComplete: boolean) => void;
  onNewVersion: (code: string) => void;
}

export function useWorkspace({ onCodeUpdate, onNewVersion }: UseWorkspaceProps) {
  const [state, setState] = useState<WorkspaceState>({
    currentTab: 'code',
    codeProgress: 0,
    isPreviewLocked: true,
    isChatLocked: true,
    isTyping: false,
    displayedCode: '',
    fullCode: '',
    chatMessages: [],
    stage: 'initial',
  });

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTypingTimers = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const callWebhook = async (webhookId: string, data: any): Promise<string> => {
    try {
      const response = await fetch(`${WEBHOOK_BASE_URL}${webhookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Webhook failed');
      
      const result = await response.text();
      return result;
    } catch (error) {
      console.error('Webhook error:', error);
      // Return mock HTML for demo purposes
      return getMockHtml();
    }
  };

  const getMockHtml = () => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redesigned Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            padding: 1rem 0;
        }
        .logo { font-size: 1.5rem; font-weight: bold; }
        nav a { 
            color: white; 
            text-decoration: none; 
            margin-left: 2rem;
            opacity: 0.9;
            transition: opacity 0.3s;
        }
        nav a:hover { opacity: 1; }
        .hero {
            text-align: center;
            padding: 6rem 0;
        }
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }
        .hero p {
            font-size: 1.25rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        .btn {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: white;
            color: #667eea;
            border-radius: 50px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 4rem 0;
        }
        .feature-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
        }
        .feature-card h3 {
            font-size: 1.25rem;
            margin: 1rem 0;
        }
        .feature-card p {
            opacity: 0.8;
            line-height: 1.6;
        }
        .icon {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">✨ ModernSite</div>
            <nav>
                <a href="#">Home</a>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Contact</a>
            </nav>
        </header>
        <section class="hero">
            <h1>Build Something<br>Amazing Today</h1>
            <p>Transform your ideas into reality with our powerful platform. Simple, fast, and beautiful.</p>
            <a href="#" class="btn">Get Started Free</a>
        </section>
        <section class="features">
            <div class="feature-card">
                <div class="icon">🚀</div>
                <h3>Lightning Fast</h3>
                <p>Optimized performance that loads in milliseconds, keeping your users engaged.</p>
            </div>
            <div class="feature-card">
                <div class="icon">🎨</div>
                <h3>Beautiful Design</h3>
                <p>Stunning templates and components that make your site stand out.</p>
            </div>
            <div class="feature-card">
                <div class="icon">🔒</div>
                <h3>Secure & Reliable</h3>
                <p>Enterprise-grade security with 99.9% uptime guarantee.</p>
            </div>
        </section>
    </div>
</body>
</html>`;

  const startTypingAnimation = useCallback((code: string, targetProgress: number, durationMs: number) => {
    clearTypingTimers();
    
    const targetLength = Math.floor(code.length * (targetProgress / 100));
    const currentLength = state.displayedCode.length;
    const charsToType = targetLength - currentLength;
    
    if (charsToType <= 0) {
      setState(prev => ({ ...prev, displayedCode: code.slice(0, targetLength) }));
      return;
    }

    const intervalMs = durationMs / charsToType;
    let currentIndex = currentLength;

    setState(prev => ({ ...prev, isTyping: true, fullCode: code }));

    typingIntervalRef.current = setInterval(() => {
      currentIndex++;
      const newDisplayed = code.slice(0, currentIndex);
      const newProgress = (currentIndex / code.length) * 100;
      
      setState(prev => ({
        ...prev,
        displayedCode: newDisplayed,
        codeProgress: newProgress,
      }));

      if (currentIndex >= targetLength) {
        clearTypingTimers();
        setState(prev => ({ ...prev, isTyping: false }));
      }
    }, intervalMs);
  }, [state.displayedCode]);

  const finishTyping = useCallback((code: string, durationMs: number = 11000) => {
    clearTypingTimers();
    
    const currentLength = state.displayedCode.length;
    const remainingChars = code.length - currentLength;
    
    if (remainingChars <= 0) {
      setState(prev => ({
        ...prev,
        displayedCode: code,
        codeProgress: 100,
        isTyping: false,
        isPreviewLocked: false,
        isChatLocked: false,
        currentTab: 'preview',
        stage: 'complete',
      }));
      onCodeUpdate(code, true);
      return;
    }

    const intervalMs = durationMs / remainingChars;
    let currentIndex = currentLength;

    setState(prev => ({ ...prev, isTyping: true }));

    typingIntervalRef.current = setInterval(() => {
      currentIndex++;
      const newDisplayed = code.slice(0, currentIndex);
      const newProgress = (currentIndex / code.length) * 100;
      
      setState(prev => ({
        ...prev,
        displayedCode: newDisplayed,
        codeProgress: newProgress,
      }));

      if (currentIndex >= code.length) {
        clearTypingTimers();
        setState(prev => ({
          ...prev,
          isTyping: false,
          isPreviewLocked: false,
          isChatLocked: false,
          currentTab: 'preview',
          stage: 'complete',
        }));
        onCodeUpdate(code, true);
      }
    }, intervalMs);
  }, [state.displayedCode, onCodeUpdate]);

  const startRedesign = useCallback(async (url: string) => {
    setState(prev => ({
      ...prev,
      stage: 'webhook-a',
      displayedCode: '',
      codeProgress: 0,
      isTyping: true,
      isPreviewLocked: true,
      isChatLocked: true,
      currentTab: 'code',
    }));

    // Call Webhook A
    const htmlFromA = await callWebhook(WEBHOOKS.A, { url });
    
    setState(prev => ({ ...prev, stage: 'webhook-b', fullCode: htmlFromA }));
    
    // Start 75% typing animation (5 minutes = 300000ms)
    startTypingAnimation(htmlFromA, 75, 300000);

    // Call Webhook B
    const resultB = await callWebhook(WEBHOOKS.B, { html: htmlFromA });
    
    setState(prev => ({ ...prev, stage: 'webhook-c' }));

    // Call Webhook C
    const resultC = await callWebhook(WEBHOOKS.C, { data: resultB });

    // Random delay 5-8 minutes
    const delay = (Math.random() * 3 + 5) * 60 * 1000;
    
    typingTimeoutRef.current = setTimeout(async () => {
      setState(prev => ({ ...prev, stage: 'webhook-d' }));
      
      // Call Webhook D
      const finalHtml = await callWebhook(WEBHOOKS.D, { data: resultC });
      
      // Replace code and finish typing remaining 25% in 11 seconds
      finishTyping(finalHtml, 11000);
    }, delay);
  }, [startTypingAnimation, finishTyping]);

  const sendChatMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, userMessage],
      stage: 'chat-refine',
      currentTab: 'code',
      isTyping: true,
    }));

    // Call Webhook E with message and current HTML
    const resultE = await callWebhook(WEBHOOKS.E, {
      message,
      html: state.fullCode,
    });

    // Random delay 5-8 minutes
    const delay = (Math.random() * 3 + 5) * 60 * 1000;

    typingTimeoutRef.current = setTimeout(async () => {
      // Call Webhook F
      const newHtml = await callWebhook(WEBHOOKS.F, { data: resultE });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Design updated! Check the preview to see the changes.',
        timestamp: new Date(),
      };

      // Update with new code
      setState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, assistantMessage],
        displayedCode: '',
        fullCode: newHtml,
        codeProgress: 0,
      }));

      // Animate the new code typing
      startTypingAnimation(newHtml, 100, 15000);
      
      // Create new version
      onNewVersion(newHtml);
    }, delay);
  }, [state.fullCode, startTypingAnimation, onNewVersion]);

  const setCurrentTab = (tab: 'code' | 'preview' | 'chat') => {
    if (tab === 'preview' && state.isPreviewLocked) return;
    if (tab === 'chat' && state.isChatLocked) return;
    setState(prev => ({ ...prev, currentTab: tab }));
  };

  useEffect(() => {
    return () => clearTypingTimers();
  }, []);

  return {
    state,
    startRedesign,
    sendChatMessage,
    setCurrentTab,
  };
}
