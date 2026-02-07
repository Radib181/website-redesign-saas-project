import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Eye, MessageSquare, Home, ChevronLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { PreviewPanel } from '@/components/PreviewPanel';
import { ChatPanel } from '@/components/ChatPanel';
import { VersionHistory } from '@/components/VersionHistory';
import { ProjectSelector } from '@/components/ProjectSelector';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useWorkspace } from '@/hooks/useWorkspace';
import { cn } from '@/lib/utils';

const Workspace = () => {
  const navigate = useNavigate();
  const {
    projects,
    currentProject,
    loadProject,
    updateProjectCode,
    addVersion,
    switchVersion,
    deleteProject,
    setCurrentProject,
  } = useProjects();

  const {
    state,
    startRedesign,
    sendChatMessage,
    setCurrentTab,
  } = useWorkspace({
    onCodeUpdate: (code, isComplete) => {
      if (currentProject) {
        updateProjectCode(currentProject.id, code, isComplete);
      }
    },
    onNewVersion: (code) => {
      if (currentProject) {
        addVersion(currentProject.id, code);
      }
    },
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const activeProjectId = sessionStorage.getItem('activeProjectId');
    const pendingUrl = sessionStorage.getItem('pendingUrl');

    if (activeProjectId) {
      loadProject(activeProjectId);
      
      if (pendingUrl && !initialized) {
        setInitialized(true);
        sessionStorage.removeItem('pendingUrl');
        // Start the redesign workflow
        setTimeout(() => startRedesign(pendingUrl), 500);
      }
    }
  }, [loadProject, startRedesign, initialized]);

  const getCurrentVersion = () => {
    if (!currentProject) return null;
    return currentProject.versions.find(v => v.id === currentProject.currentVersionId);
  };

  const currentVersion = getCurrentVersion();

  const tabs = [
    { id: 'code' as const, label: 'Code Editor', icon: Code2, locked: false },
    { id: 'preview' as const, label: 'Preview', icon: Eye, locked: state.isPreviewLocked },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare, locked: state.isChatLocked },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <Home className="w-4 h-4" />
            </Button>
            
            <div className="h-6 w-px bg-border" />
            
            <ProjectSelector
              projects={projects}
              currentProject={currentProject}
              onSelectProject={loadProject}
              onNewProject={() => navigate('/')}
              onDeleteProject={deleteProject}
            />
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
            <span className="status-dot status-dot-connected" />
            <span className="text-sm text-muted-foreground">
              <span className="text-emerald-400">Connected</span>
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              disabled={tab.locked}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                state.currentTab === tab.id
                  ? "bg-primary/20 text-foreground border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                tab.locked && "opacity-50 cursor-not-allowed"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.locked && (
                <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 p-4 overflow-hidden">
          {state.currentTab === 'code' && (
            <CodeEditor
              code={state.displayedCode}
              isTyping={state.isTyping}
              progress={state.codeProgress}
            />
          )}
          {state.currentTab === 'preview' && (
            <PreviewPanel
              htmlCode={state.fullCode || currentVersion?.htmlCode || ''}
              isLocked={state.isPreviewLocked}
            />
          )}
          {state.currentTab === 'chat' && (
            <ChatPanel
              messages={state.chatMessages}
              isLocked={state.isChatLocked}
              isProcessing={state.stage === 'chat-refine' && state.isTyping}
              onSendMessage={sendChatMessage}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="w-72 shrink-0 p-4 border-l border-border/50 overflow-y-auto">
          {/* Progress */}
          <div className="glass-card p-4 mb-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Code Generation</span>
                  <span className="text-foreground">{Math.round(state.codeProgress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink transition-all duration-300"
                    style={{ width: `${state.codeProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  state.isTyping ? "bg-neon-cyan animate-pulse" : "bg-emerald-400"
                )} />
                <span className="text-muted-foreground">
                  {state.isTyping ? 'AI is writing...' : 
                   state.stage === 'complete' ? 'Ready for refinement' :
                   state.stage === 'initial' ? 'Waiting for URL' : 'Processing...'}
                </span>
              </div>
            </div>
          </div>

          {/* Stage Indicator */}
          <div className="glass-card p-4 mb-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Workflow Stage</h3>
            <div className="space-y-2">
              {[
                { id: 'webhook-a', label: 'Scraping Page', stages: ['webhook-a', 'webhook-b', 'webhook-c', 'webhook-d', 'complete', 'chat-refine'] },
                { id: 'webhook-b', label: 'Processing Content', stages: ['webhook-b', 'webhook-c', 'webhook-d', 'complete', 'chat-refine'] },
                { id: 'webhook-c', label: 'Generating Design', stages: ['webhook-c', 'webhook-d', 'complete', 'chat-refine'] },
                { id: 'webhook-d', label: 'Finalizing Code', stages: ['webhook-d', 'complete', 'chat-refine'] },
                { id: 'complete', label: 'Ready', stages: ['complete', 'chat-refine'] },
              ].map((stage, i) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                    stage.stages.includes(state.stage)
                      ? "bg-gradient-to-r from-neon-blue to-neon-purple text-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {i + 1}
                  </div>
                  <span className={cn(
                    "text-sm transition-colors duration-300",
                    stage.stages.includes(state.stage) ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Version History */}
          {currentProject && currentProject.versions.length > 0 && (
            <VersionHistory
              versions={currentProject.versions}
              currentVersionId={currentProject.currentVersionId}
              onSelectVersion={(versionId) => switchVersion(currentProject.id, versionId)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
