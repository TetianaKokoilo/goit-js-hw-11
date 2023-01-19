
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './js/search-image';
import { createListsImages } from './js/create-image';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.js-gallery');
const loadMoreBtn = document.querySelector('.js-load-more');
const observerGuard = document.querySelector(".js-guard");
const infinityCheckBox = document.querySelector('.js-allow-infinity');
const checkBoxLabel = document.querySelector('.js-allow-infinity-label');

let page = 1;
let pages = 1;
let previousSearchValue = '';
let isInfinityLoad = null;

const options = {
    root: null,
    rootMargin: '300px',
    threshold: 1.0,
};
const intersectionObserver = new IntersectionObserver(handleIntersection, options);
hideCheckBox();

searchForm.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
infinityCheckBox.addEventListener('change', setInfinityLoad);

function onFormSubmit(evt) {
    evt.preventDefault();
    const currentSearchValue = evt.target.elements.searchQuery.value.trim();
    const isPreviusValue = previousSearchValue !== '' && previousSearchValue !== currentSearchValue;
    
    if (isPreviusValue) {
        resetSearch();
    };
    if (!currentSearchValue) {
        return Notify.failure('Enter your request, please.');
    };
    previousSearchValue = currentSearchValue;
    renderItems(currentSearchValue, page);
    incrementPage();
};

function onLoadMore() { 
    loadMoreBtn.classList.replace('show', 'hide');
    renderItems(previousSearchValue, page);
    incrementPage();
};

function handleIntersection(entries, observer) {
     entries.forEach(entry => {
    if (entry.isIntersecting && previousSearchValue)  onLoadMore();
    if (pages < page) {
        observer.unobserve(observerGuard);
    }
  });
};

async function renderItems(searchRequest, searchPage) {
    try {
        const response = await getImages(searchRequest, searchPage);
        const arrayOfImages = response.data.hits;
        const foundImagesQty = response.data.totalHits;
        const totalFoundImages = response.data.total;
        pages = Math.round(totalFoundImages / foundImagesQty);

        if (!totalFoundImages) {
            return Notify.info('Sorry, there are no images matching your search query. Please try again.');
        };
        if (!arrayOfImages.length) {
           return Notify.failure("We're sorry, but you've reached the end of search results.");
        };
        if (page - 1 === 1) {
           Notify.success(`Hooray! We found ${foundImagesQty} images.`);
        };
        createListsImages(arrayOfImages, gallery);
        loadMoreBtn.classList.replace('hide', 'show');
        showCheckBox();
    } catch (error) {
        console.error(error.stack);  
    };
};

function incrementPage() {
    return page += 1;
};

function resetSearch() {
    page = 1;
    gallery.innerHTML = '';
    infinityCheckBox.checked = false;
    intersectionObserver.unobserve(observerGuard);
};

function hideCheckBox() {
    infinityCheckBox.hidden = true;
    checkBoxLabel.hidden = true;
};

function showCheckBox() {
    infinityCheckBox.hidden = false;
    checkBoxLabel.hidden = false;
};

function setInfinityLoad(event) {
  isInfinityLoad = event.currentTarget.checked;
  isInfinityLoad
    ? intersectionObserver.observe(observerGuard)
        : intersectionObserver.unobserve(observerGuard);
};