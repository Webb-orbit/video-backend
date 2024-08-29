class Apierr extends Error {
    constructor(ststuscode, message="some went wrong", errs=[], statck){
        super(message)
        this.ststuscode = ststuscode,
        this.message = message,
        this.errs = errs,
        this.statck = statck,
        this.susses = false
        
        if (statck) {
            this.statck = statck
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default Apierr