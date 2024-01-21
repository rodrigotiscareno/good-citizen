export type UserModel = {
  user_id: number;
  email: string;
  password_hash: string;
  created_on: Date;
  status: string;
  first_name: string;
  last_name: string;
  postal_code: string;
  profile_picture_link: string;
  neighborhood_id: number;
  user_type: string;
};

export type UserModelUI = {
  first_name: string;
  last_name: string;

  profile_picture_link: string;
  neighborhood_id?: number;
  user_type?: string;
};
