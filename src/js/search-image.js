

import axios from 'axios';
export async function newView(value, page, perPage) {
  const resp = await axios.get(
    `https://pixabay.com/api/?key=32970758-8ba6ee6d9fec7577e22e4216e&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
  console.log('resp.data', resp.data);
  return await resp.data;
}
