
export type StorageValueType = string | number | boolean

export const hasStorageRecord = async (key: string): Promise<boolean> => {
  let items = await browser.storage.local.get(key)
  return key in items
}
  
export const getStorageRecord = async (key: string): Promise<StorageValueType> => {
  let items = await browser.storage.local.get(key)
  if (key in items) {
    return items[key]
  }
  throw new Error(`An record with key ${key} not found`)
}

export const setStorageRecord = async (key: string, value: StorageValueType) => {
  await browser.storage.local.set({ [key]: value})
}
