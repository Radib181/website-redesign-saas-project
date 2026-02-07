import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Sparkles, RefreshCw, Eye, MessageSquare, Zap } from 'lucide-react';
import { Header } from '@/components/Header';
import { FeaturePill } from '@/components/FeaturePill';
import { GlowingInput } from '@/components/GlowingInput';
import { useProjects } from '@/hooks/useProjects';

const Index = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    
    // Create project and store URL
    const project = createProject(url);
    
    // Store project ID for workspace to use
    sessionStorage.setItem('activeProjectId', project.id);
    sessionStorage.setItem('pendingUrl', url);
    
    // Navigate to workspace
    navigate('/workspace');
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm text-muted-foreground">Powered by n8n Workflows</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Paste any URL.
              <br />
              <span className="text-gradient">AI</span> rebuilds your{' '}
              <span className="text-gradient">website</span>
              <br />
              with a cleaner, modern layout.
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We scrape your page, send it through a multi-step n8n workflow, 
              and progressively "code" the new design in front of you before 
              letting you chat to refine it.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <FeaturePill icon={Code2} text="75% live code-typing" />
            <FeaturePill icon={Eye} text="Auto preview replace" />
            <FeaturePill icon={RefreshCw} text="Looped design updates via chat" />
          </div>

          {/* URL Input */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <GlowingInput onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* How It Works */}
          <div className="mt-24 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold text-center text-foreground mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  icon: Zap,
                  title: 'Scrape',
                  description: 'We analyze and extract the content from your existing page.',
                },
                {
                  step: '02',
                  icon: Code2,
                  title: 'Rebuild',
                  description: 'AI generates a modern, clean design with live code typing.',
                },
                {
                  step: '03',
                  icon: MessageSquare,
                  title: 'Refine',
                  description: 'Chat to iterate and perfect your new design endlessly.',
                },
              ].map((item, i) => (
                <div 
                  key={item.step}
                  className="glass-card-hover p-6 text-center group"
                >
                  <div className="text-xs font-mono text-neon-cyan mb-4">{item.step}</div>
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-neon-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-24">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Weby · AI Re-Designer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Powered by advanced AI workflows
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
