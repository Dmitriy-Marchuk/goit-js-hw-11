import axios from 'axios';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    // this.currentPage;
    this.pageSize = 40;
  }

  async fetchArticles() {
    const KEY_API = '28343249-1460158105f561498120f2a7a';
    const URL_MAIN = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: KEY_API,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.pageSize,
    });
    const url = `${URL_MAIN}?${searchParams}`;

    const imagesResponse = await axios.get(url);
    imagesResponse.data.page = this.page;
    imagesResponse.data.pageSize = this.pageSize;
    return imagesResponse;
  }

  incrimentPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get currentPage() {
    return this.page;
  }
}
