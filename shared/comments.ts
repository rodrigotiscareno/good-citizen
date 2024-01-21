export enum CommentsParentType {
  VOICE,
  EVENT,
  POST,
}

export type CommentsRow = {
  comment_id?: number;
  user_id: number;
  created_on: Date;
  content: string;
  status: string;
  feed_id?: number;
  voice_id?: number;
  event_id?: number;
};

export type NewCommentUIModel = {
  user_id: number;
  content: string;
  feed_id?: number;
  voice_id?: number;
  event_id?: number;
};
