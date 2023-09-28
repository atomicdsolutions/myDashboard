export interface Report {
    key: string;
    total: {
      keyId: number;
      keymetric: number;
      keyName: string;
    };
    data: {
      key: string;
      total: {
        series: {
          series_id_exp: string;
          series_id_exp_name: string;
        };
        inventory: number;
      };
      data: any[];
    }[];
  }
  
  export interface ApiData {
    total: {
      inventory: number;
    };
    data: Report[];
  }