import { useState, useEffect } from 'react';
import { Project, Version } from '@/types/project';

const STORAGE_KEY = 'weby-projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setProjects(parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        versions: p.versions.map((v: any) => ({
          ...v,
          createdAt: new Date(v.createdAt),
        })),
      })));
    }
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const createProject = (url: string, name?: string): Project => {
    const id = crypto.randomUUID();
    const now = new Date();
    const versionId = crypto.randomUUID();
    
    const newProject: Project = {
      id,
      name: name || `Project ${projects.length + 1}`,
      url,
      createdAt: now,
      updatedAt: now,
      versions: [{
        id: versionId,
        number: 1,
        htmlCode: '',
        createdAt: now,
        isComplete: false,
      }],
      currentVersionId: versionId,
    };

    const updated = [...projects, newProject];
    saveProjects(updated);
    setCurrentProject(newProject);
    return newProject;
  };

  const updateProjectCode = (projectId: string, code: string, isComplete: boolean = false) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        const updatedVersions = p.versions.map(v => {
          if (v.id === p.currentVersionId) {
            return { ...v, htmlCode: code, isComplete };
          }
          return v;
        });
        return { ...p, versions: updatedVersions, updatedAt: new Date() };
      }
      return p;
    });
    saveProjects(updated);
    
    if (currentProject?.id === projectId) {
      const updatedProject = updated.find(p => p.id === projectId);
      if (updatedProject) setCurrentProject(updatedProject);
    }
  };

  const addVersion = (projectId: string, code: string): Version => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const versionId = crypto.randomUUID();
    const newVersion: Version = {
      id: versionId,
      number: project.versions.length + 1,
      htmlCode: code,
      createdAt: new Date(),
      isComplete: true,
    };

    const updated = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          versions: [...p.versions, newVersion],
          currentVersionId: versionId,
          updatedAt: new Date(),
        };
      }
      return p;
    });
    saveProjects(updated);

    if (currentProject?.id === projectId) {
      const updatedProject = updated.find(p => p.id === projectId);
      if (updatedProject) setCurrentProject(updatedProject);
    }

    return newVersion;
  };

  const switchVersion = (projectId: string, versionId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, currentVersionId: versionId };
      }
      return p;
    });
    saveProjects(updated);

    if (currentProject?.id === projectId) {
      const updatedProject = updated.find(p => p.id === projectId);
      if (updatedProject) setCurrentProject(updatedProject);
    }
  };

  const loadProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) setCurrentProject(project);
    return project;
  };

  const deleteProject = (projectId: string) => {
    const updated = projects.filter(p => p.id !== projectId);
    saveProjects(updated);
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  };

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProjectCode,
    addVersion,
    switchVersion,
    loadProject,
    deleteProject,
  };
}
