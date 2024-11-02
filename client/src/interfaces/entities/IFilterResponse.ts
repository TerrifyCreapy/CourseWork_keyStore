export interface Filter {
    id: number,
    name: string
}

export interface IFilterResponse {
    count: number;
    rows: Filter[]
}
