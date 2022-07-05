import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import ApiService from './js/components/api-service';
import LoadMoreBtn from './js/components/load-more-btn';

const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('div.gallery'),
  // loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

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
  apiService.fetchArticles().then(({ total, hits }) => {
    if (total === 0) {
      loadMoreBtn.hide();
      clearArticlesContainer();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    loadMoreBtn.show();
    loadMoreBtn.enable();
    clearArticlesContainer();
    makeMarkupBox(hits);
    lightbox.refresh();
    Notiflix.Notify.info(`Hooray! We found ${total} images.`);
  });
}

function onLoadMore() {
  loadMoreBtn.disable();
  apiService.fetchArticles().then(({ hits }) => {
    makeMarkupBox(hits);
    loadMoreBtn.enable();
    lightbox.refresh();
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

let lightbox = new SimpleLightbox('.gallery a', {});
