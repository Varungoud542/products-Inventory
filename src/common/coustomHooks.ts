export const isItemOfLocalStorage = (name: string) => {
  return localStorage.getItem(name) ? true : false;
};

export const setToLocalStorage = (name: string, payload: Array<Object>) => {
  return localStorage.setItem(name, JSON.stringify(payload));
};

export const getToLocalStorage = (name: string) => {
  let data: string | null = localStorage.getItem(name);
  if (data) return JSON.parse(data);
};
