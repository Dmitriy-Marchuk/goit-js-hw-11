import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import ApiService from './js/components/api-service';
import LoadMoreBtn from './js/components/load-more-btn';
const axios = require('axios');

const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('div.gallery'),
};

let lightbox = new SimpleLightbox('.gallery a', {});
const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onFormSubmit(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.searchQuery.value.trim();
  apiService.resetPage();
  loadMoreBtn.disable();
  loadMoreBtn.hide();

  if (apiService.query == '') {
    return Notiflix.Notify.failure('Enter a query in the search!');
  }
  apiService.fetchArticles().then(({ data }) => {
    if (data.total === 0) {
      loadMoreBtn.hide();
      clearArticlesContainer();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    loadMoreBtn.show();
    loadMoreBtn.enable();
    clearArticlesContainer();
    makeMarkupBox(data.hits);
    lightbox.refresh();
    Notiflix.Notify.info(`Hooray! We found ${data.total} images.`);

    loadMoreIsVisibleForSearch(data);
  });
}

function onLoadMore() {
  loadMoreBtn.disable();
  apiService.incrimentPage();

  apiService.fetchArticles().then(({ data }) => {
    makeMarkupBox(data.hits);
    loadMoreBtn.enable();
    lightbox.refresh();
    loadMoreIsVisible(data);
  });
}

function makeMarkupBox(hits) {
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
            <a class="card-link" href="${largeImageURL}">
                <div class="card-box">
                    <img class="main-img" src="${webformatURL}" alt="${tags}" />
                    <div class="info">
                      <p class="card-info-item">Likes  <br/> ${likes}</p>
                      <p class="card-info-item">Views  <br/> ${views}</p>
                      <p class="card-info-item">Comments  <br/> ${comments}</p>
                      <p class="card-info-item">Downloads  <br/> ${downloads}</p>
                    </div>
                </div>
            </a>
        `;
      }
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearArticlesContainer() {
  refs.galleryContainer.innerHTML = '';
}

function loadMoreIsVisible(data) {
  const lastPage = Math.ceil(data.totalHits / data.pageSize);
  if (data.page === lastPage) {
    loadMoreBtn.hide();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function loadMoreIsVisibleForSearch(data) {
    const lastPage = Math.ceil(data.totalHits / data.pageSize);
  if (data.page === lastPage) {
    loadMoreBtn.hide();
}