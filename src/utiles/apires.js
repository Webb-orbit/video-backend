class Apiresponse {
    constructor(ststuscode, data, message, ){
        this.ststuscode = ststuscode
        this.data = data
        this.message = message
        this.seccess = ststuscode < 400
    }
}

export default Apiresponse