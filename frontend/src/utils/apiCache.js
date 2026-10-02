import axios from 'axios';

const cache = new Map();

export const cachedGet = async (url, config, forceRefetch = false) => {
  if (!forceRefetch && cache.has(url)) {
    // Return cached data immediately, but refetch in background to keep it fresh
    axios.get(url, config).then(res => cache.set(url, res.data)).catch(err => console.error('Background refetch failed:', err));
    return { data: cache.get(url) };
  }
  const res = await axios.get(url, config);
  cache.set(url, res.data);
  return res;
};

export const getCachedDataSync = (url) => cache.get(url);

export const clearCache = (url) => {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
};
