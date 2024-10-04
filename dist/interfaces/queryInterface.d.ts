export interface Query {
    aggregate?: string[];
    include?: string[];
    filter?: {
        [key: string]: any;
    };
    search?: string;
    sort?: string;
    order?: 'ASC' | 'DESC';
    date?: number | string;
    page?: number | string;
    limit?: number | string;
    company_id?: string;
}
