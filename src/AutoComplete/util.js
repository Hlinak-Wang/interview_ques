
export function maxKeyInDic(obj, array) {
  let matched = {}
  for (let item of array) {
    matched[item] = obj[item]
  }
  
  return  Object.keys(matched).sort((a,b) => matched[b] - matched[a])[0]
}

