const API_URL = 'https://v1.jinrishici.com/all.json';
export const getData = async () => {
  // 一次性请求三次
  const res = []
  for (let i = 0; i < 3; i++) {
    const data = await fetch(API_URL)
    res.push(await data.json())
  }
  return res
}