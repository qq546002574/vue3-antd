export interface ModalProps {
    id?: string | number;
    title?: string;
    label?: string;
    defaultValue?: string;
    callback?: (result: any) => any;
    reqMethod: (params: any) => Promise<any>;
    [propName: string]: any;
}
