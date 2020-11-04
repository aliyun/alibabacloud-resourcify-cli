export const requestFeatch = (url: string, method = 'GET', body = null) => {
  return fetch(url, {
    method,
    body,
  }).then((result) => {
    return result.json();
  });
};

export const getSublist = () => {
  return requestFeatch('/product');
};
