export interface Query {
    filters: Filters[];
    splitters: Splitters[];
    metrics: string[];
    timezone: string;
    interval: {
      from: string;
      to: string;
    };
    sort: {
      id: string;
      dir: string;
    };
    currency: string;
  }
  
  export interface Filters {
    id: string;
    values: string[];
    type: string;
  }
  
  export interface Splitters {
    id: string;
    limit: number;
  }