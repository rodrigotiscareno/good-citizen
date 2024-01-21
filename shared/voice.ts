import { UserModel } from "./user";
export type VoiceModel = {
  voice_id: number;
  user_id: number;
  question: string;
  description: string;
  is_mc: boolean;
  is_shortanswer: boolean;
  is_datetime: boolean;
  duration_days: number;
  created_on: Date;
  end_date: Date;
  status: string;
};

export type VoiceMultipleChoiceOptionsModel = {
  voice_mc_option_id: number;
  voice_id: number;
  title: string;
};

export type VoiceResultsModel = {
  voice_result_id: number;
  voice_id: number;
  user_id: number;
  answer: string;
  created_on: Date;
};

export type VoiceModelUI = {
  voice_id: number;
  user_id: number;
  question: string;
  description: string;
  is_mc: boolean;
  is_shortanswer: boolean;
  is_datetime: boolean;
  duration_days: number;
  created_on: Date;
  end_date: Date;
  status: string;
  options: VoiceMultipleChoiceOptionsModel[];
  results?: VoiceResultsModel[];
  meta_analysis?: any;
  user?: UserModel;
  comments?: any[];
};
