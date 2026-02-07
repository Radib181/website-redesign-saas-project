export interface Project {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  versions: Version[];
  currentVersionId: string;
}

export interface Version {
  id: string;
  number: number;
  htmlCode: string;
  createdAt: Date;
  isComplete: boolean;
}

export interface WorkspaceState {
  currentTab: 'code' | 'preview' | 'chat';
  codeProgress: number;
  isPreviewLocked: boolean;
  isChatLocked: boolean;
  isTyping: boolean;
  displayedCode: string;
  fullCode: string;
  chatMessages: ChatMessage[];
  stage: 'initial' | 'webhook-a' | 'webhook-b' | 'webhook-c' | 'webhook-d' | 'complete' | 'chat-refine';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface WebhookConfig {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
}

export const WEBHOOKS: WebhookConfig = {
  A: 'b84774fb-e992-428a-a84c-fdc4434b1476',
  B: 'b84774fb-e992-428a-a84c-fdc4434b14',
  C: '4cfe8a82-df61-4a97-a228-876476f681f9',
  D: 'a57c9331-237f-4ba7-8af6-f5315f34a513',
  E: 'd3c1d29e-2383-424e-a741-655179d22231',
  F: 'ded96ef1-97b9-48d9-aa05-f58c8ca16219',
};
