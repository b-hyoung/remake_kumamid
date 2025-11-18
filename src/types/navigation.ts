import { UrlObject } from "url";

export type years = {
    year: number,
    status: string,
    path?: UrlObject,
    message?: string
};

export type headerList = {
    page: string,
    path: UrlObject,
    label: string
    subItems?: headerList[]
};
