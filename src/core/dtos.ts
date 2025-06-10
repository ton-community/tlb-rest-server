export class ResponseDTO<T> {
    error?: string;
    result?: T;

    static fromError(error: string, details?: unknown) {
        return new ResponseDTO(false, error, details);
    }

    static fromResult<T>(result: T) {
        return new ResponseDTO(true, result);
    }

    private constructor(success: false, error?: string, details?: unknown);
    private constructor(success: true, result: T);
    private constructor(
        readonly success: boolean,
        errorOrResult?: T,
        readonly details?: unknown,
    ) {
        if (success) {
            this.result = errorOrResult;
        } else {
            this.error = errorOrResult as string;
        }
    }
}
