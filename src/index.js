
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './js/search-image';
import { createListsImages } from './js/create-image';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let previousSearchValue = '';

searchForm.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

function onFormSubmit(evt) {
  evt.preventDefault();
  const currentSearchValue = evt.target.elements.searchQuery.value.trim();
  const isPreviusValue =
    previousSearchValue !== '' && previousSearchValue !== currentSearchValue;

  if (isPreviusValue) {
    resetGallery();
  }
  if (!currentSearchValue) {
    return Notify.failure('Enter your request, please.');
  }
  previousSearchValue = currentSearchValue;
  renderGalleryItems(currentSearchValue, page);
  incrementPage();
}

function onLoadMore() {
  loadMoreBtn.classList.replace('show', 'hide');
  renderGalleryItems(previousSearchValue, page);
  incrementPage();
}

async function renderGalleryItems(searchRequest, searchPage) {
  try {
    const response = await getImages(searchRequest, searchPage);
    const arrayOfImages = response.data.hits;
    const foundImagesQty = response.data.totalHits;
    const totalFoundImages = response.data.total;
    pages = Math.round(totalFoundImages / foundImagesQty);

    if (!totalFoundImages) {
      return Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (!arrayOfImages.length) {
      return Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    if (page - 1 === 1) {
      Notify.success(`Hooray! We found ${foundImagesQty} images.`);
    }
    createListsImages(arrayOfImages, gallery);
    loadMoreBtn.classList.replace('hide', 'show');
  } catch (error) {
    console.error(error.stack);
  }
}

function incrementPage() {
  return (page += 1);
}

function resetGallery() {
  page = 1;
  gallery.innerHTML = '';
}
