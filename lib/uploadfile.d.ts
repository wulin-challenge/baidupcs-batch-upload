declare const fatalerror: string[];
export { fatalerror };
export declare function upload(
    file: string,
    destination: string
): Promise<void>;
export declare function uploadandcheck(
    file: string,
    destination: string
): Promise<void>;
