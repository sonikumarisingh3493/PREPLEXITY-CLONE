export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type Mode =
  | 'web'
  | 'reddit'
  | 'youtube'
  | 'images'
  | 'videos'
  | 'write';