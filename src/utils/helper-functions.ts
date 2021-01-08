import getPlates from '../api/proxy/get-plates';
import reloadPlates from '../api/reload-plates';

export const callReloadPlates = (
  url: string,
  token: string,
  onSuccess?: () => void,
  onError?: () => void
) => {
  // TODO: automate
  getPlates((data) => {
    reloadPlates(url, token, data.body, (data) => {
      if (data.status === 200) onSuccess && onSuccess();
      else onError && onError();
    });
  });
};
