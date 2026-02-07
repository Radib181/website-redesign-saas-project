import { useState } from 'react';
import { FolderOpen, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectSelectorProps {
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectSelector({
  projects,
  currentProject,
  onSelectProject,
  onNewProject,
  onDeleteProject,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="glass"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <FolderOpen className="w-4 h-4" />
        <span>{currentProject?.name || 'Select Project'}</span>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-2 w-72 z-50 glass-card p-2 animate-scale-in">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 mb-2">
              <span className="text-sm font-medium text-foreground">Your Projects</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onNewProject();
                  setIsOpen(false);
                }}
                className="h-7 gap-1.5"
              >
                <Plus className="w-3 h-3" />
                New
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Now project here ......Create a new project to get started! !! 
                </p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                      project.id === currentProject?.id
                        ? "bg-primary/20 border border-primary/30"
                        : "hover:bg-secondary/80"
                    )}
                    onClick={() => {
                      onSelectProject(project.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.url, '_blank');
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
