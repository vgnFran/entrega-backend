export default class errorManager extends Error{
    constructor(err,detail=""){
        if (detail!= "") {console.log(detail)}
        super(err.message) // super para pasar parametros a la clase extendida (Error)
        this.statusCode= err.code


    }
}