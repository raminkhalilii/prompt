export interface Prompt {
  _id?: string;
  title: string;
  description: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  liked?: boolean;
}

export interface CreatePromptDto {
  title: string;
  description: string;
  createdBy?: string;
  liked?: boolean;
}

export interface UpdatePromptDto {
  title?: string;
  description?: string;
  createdBy?: string;
  liked?: boolean;
}
