export interface ISupplement {
  content: string;
  createdAt: string;
}

export interface ITopic {
  id: number;
  title: string;
  nodeName: string;
  nodeTitle: string;
  vote: number;
  lastRepliedBy?: string;
  replyCount: number;
  avatar: string;
  author: string;
  createdAt?: string;
  content?: string;
  supplementList?: Array<ISupplement>;
  via?: string;
  isCollect?: boolean;
  views?: number;
  likes?: number;
  thanks?: number;
  lastReplyDatetime?: string;
  csrfToken?: string;
}
