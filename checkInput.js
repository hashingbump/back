function checkNullOrUndefined(...args){
    if(args.length<1) return true;
    for(const arg of args)
        if(arg === null || arg === undefined)
            return true;
    return false;
}

function verifyFields(arg1, arg2){
    if(arg1.length<1 || arg2.length<1) return false;
    for(const arg of arg1)
        if(!arg2.includes(arg)) return false;
    return true;
}

export {checkNullOrUndefined, verifyFields};
