export type VideoCollectionItem = {
  id: string;
  name: string;
  contentType: number;
  filterType: number;
  count: number;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type VideoCollectionPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type VideoCollectionData = {
  items: VideoCollectionItem[];
  current: number;
  total: number;
};

export type VideoCollectionParams = {
  id: string;
  name: string;
  contentType: number;
  filterType: number;
  count: number;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
