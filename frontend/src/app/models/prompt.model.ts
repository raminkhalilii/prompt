export interface Prompt {
  _id?: string;
  title: string;
  description: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePromptDto {
  title: string;
  description: string;
  createdBy?: string;
}

export interface UpdatePromptDto {
  title?: string;
  description?: string;
  createdBy?: string;
}
