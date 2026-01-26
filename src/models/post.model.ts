export type CreatePostInput = {
  title: string;
  content: string;
  slug: string;
  published?: boolean;
  authorId: string;
  categoryId?: string;
};

export type UpdatePostInput = Partial<Omit<CreatePostInput, "authorId">>;

export type PostFilter = {
  title?: string;
  published?: boolean;
  authorId?: string;
  categoryId?: string;
};
