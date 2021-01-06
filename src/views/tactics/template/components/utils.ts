const formatOptions = (record) => {
    const policyOptions = {
        0: '自动加密',
        256: '手动加密',
        64: '使用副本加密',
        128: '扩展名不匹配禁止加密',
    }
    const arr: string[] = []
    if (0==(256&record.policysum)) {
        arr.push(policyOptions[0])
        if(0!=(64&record.policysum)){ // 加密副本
            arr.push(policyOptions[64])
        }
    } else {
        arr.push(policyOptions[256])
    }
    if(0!=(128&record.policysum)){ // 扩展名不匹配禁止加密
        arr.push(policyOptions[128])
    }
    return arr.join('|')
}

export {
    formatOptions
}
