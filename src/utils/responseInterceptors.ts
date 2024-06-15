import { AxiosResponse } from "axios";

export function populateKeyWithId(response: AxiosResponse) {
  const { data } = response;
  if (data && data.items) {
    response.data.items = data.items.map((item: any) => {
      if (item.id) {
        return ({
          key: item.id,
          ...item,
        })
      }
      return item;
    });
  }
  return response
}
