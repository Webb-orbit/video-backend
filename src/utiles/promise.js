const promisecontrole = (fun) => {
    return (req, res, next) => {
        Promise.resolve(fun(req, res, next)).catch((err) => next(err))
    }
}

export { promisecontrole }