export interface IBrowserRouter {
    path: string;
    exact: boolean;
    component: unknown;
    outlet?: IBrowserRouter[]
}