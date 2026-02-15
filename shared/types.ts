// Paylaşılan TypeScript tipleri - Frontend ve Backend için ortak

export interface User {
  id: string;
  socketId: string;
  username?: string;
  isAnonymous: boolean;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  country?: string;
  interests: string[];
  isPremium: boolean;
  status: 'online' | 'searching' | 'matched' | 'busy' | 'offline';
  reputation: number;
  joinedAt: Date;
  lastActive: Date;
}

export interface Match {
  id: string;
  user1: User;
  user2: User;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  reportedBy?: string[];
  reason?: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'emoji' | 'sticker';
  isRead: boolean;
}

export interface Filter {
  gender?: 'male' | 'female' | 'other' | 'any';
  ageRange?: {
    min: number;
    max: number;
  };
  country?: string[];
  interests?: string[];
  onlyVerified?: boolean;
  excludeReported?: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  matchId: string;
  reason: 'inappropriate_content' | 'harassment' | 'spam' | 'underage' | 'other';
  description?: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  screenshots?: string[];
}

export interface WebRTCOffer {
  type: 'offer';
  sdp: string;
}

export interface WebRTCAnswer {
  type: 'answer';
  sdp: string;
}

export interface ICECandidate {
  candidate: string;
  sdpMLineIndex: number;
  sdpMid: string;
}

// Socket Event Types
export interface ServerToClientEvents {
  // Matching events
  'match:found': (match: Match) => void;
  'match:ended': (reason: 'user_left' | 'other_left' | 'skip' | 'reported') => void;
  'match:searching': () => void;
  
  // Chat events
  'message:received': (message: Message) => void;
  'message:typing': (isTyping: boolean) => void;
  
  // WebRTC signaling
  'webrtc:offer': (offer: WebRTCOffer) => void;
  'webrtc:answer': (answer: WebRTCAnswer) => void;
  'webrtc:ice-candidate': (candidate: ICECandidate) => void;
  
  // User events
  'user:connected': (user: User) => void;
  'user:disconnected': () => void;
  'user:blocked': (userId: string) => void;
  
  // System events
  'stats:update': (stats: Stats) => void;
  'error': (error: ErrorResponse) => void;
  'notification': (notification: Notification) => void;
}

export interface ClientToServerEvents {
  // Matching
  'match:start': (filters?: Filter) => void;
  'match:skip': () => void;
  'match:end': () => void;
  
  // Chat
  'message:send': (content: string) => void;
  'message:typing': (isTyping: boolean) => void;
  
  // WebRTC
  'webrtc:offer': (offer: WebRTCOffer) => void;
  'webrtc:answer': (answer: WebRTCAnswer) => void;
  'webrtc:ice-candidate': (candidate: ICECandidate) => void;
  
  // User actions
  'user:report': (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
  'user:block': (userId: string) => void;
  'user:update': (updates: Partial<User>) => void;
  
  // Stats
  'stats:request': () => void;
}

export interface Stats {
  onlineUsers: number;
  activeMatches: number;
  totalUsers: number;
  averageWaitTime: number;
  peakHours: number[];
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: string;
  };
}

// Premium Features
export interface PremiumFeatures {
  noAds: boolean;
  advancedFilters: boolean;
  priorityMatching: boolean;
  rewindLastSkip: boolean;
  unlimitedSkips: boolean;
  customStickers: boolean;
  profileCustomization: boolean;
  matchHistory: boolean;
}

// AI Moderation
export interface ModerationResult {
  isSafe: boolean;
  confidence: number;
  categories: {
    adult: number;
    violence: number;
    hate: number;
    selfHarm: number;
  };
  action: 'allow' | 'warn' | 'block' | 'report';
}

// Settings
export interface UserSettings {
  userId: string;
  notifications: {
    sound: boolean;
    browser: boolean;
    newMatch: boolean;
    messages: boolean;
  };
  privacy: {
    showAge: boolean;
    showCountry: boolean;
    showOnlineStatus: boolean;
    allowAnonymousMatch: boolean;
  };
  video: {
    quality: 'low' | 'medium' | 'high' | 'auto';
    enableBlur: boolean;
    enableVirtualBackground: boolean;
  };
  chat: {
    fontSize: number;
    showTimestamps: boolean;
    enableEmojis: boolean;
  };
}
