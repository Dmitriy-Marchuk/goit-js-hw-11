export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchArticles() {
    const KEY_API = '28343249-1460158105f561498120f2a7a';
    const URL_MAIN = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: KEY_API,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 4,
    });
    const url = `${URL_MAIN}?${searchParams}`;

    const imagesResponse = fetch(url)
      .then(response => response.json())
      .then(data => {
        this.incrimentPage();
        return data;
      });
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
}
