export type VideoCollectionItem = {
  id: string;
  name: string;
  contentType: string;
  filterType: string;
  count: number;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PageRequest = {
  number: number;
  size: number;
  sorts?: Sort[];
}

export type PageInfo = {
  number: number;
  size: number;
  numberOfElements: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  sorts: Sort[]
};

export type Sort = {
  property: string,
  direction: string,
}

export type VideoCollectionData = {
  items: VideoCollectionItem[];
  pageInfo: PageInfo;
};

export type VideoCollectionParams = {
  id: string;
  name: string;
  contentType: string;
  filterType: string;
  count: number;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
