class ApiError extends Error{
    constructor(message,statusCode,data=null,success=false,error=null,stack=null){
        super(message)
        this.name="ApiError";
        this.statusCode=statusCode;
        this.data=data;
        this.success=success;
        this.error=error;
        if(stack){
            this.stack=stack;
        } else {
            Error.captureStackTrace(this,this.constructor);
        }


    }
}

export default ApiError