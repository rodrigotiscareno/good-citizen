import { UserModelUI } from "./../../shared/user";
export type CommentUIModel = {
  comment_id?: number;
  user_id: number;
  created_on: Date;
  content: string;
  status: string;
  feed_id?: number;
  voice_id?: number;
  event_id?: number;

  user: UserModelUI;
  feed?: any;
  voice?: any;
  event?: any;
};
