import Notiflix from 'notiflix';
import markupTpl from './markupTpl';
import apiService from './apiService';
import refs from './refs';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

Notiflix.Notify.init({
  distance: '5%',
  fontSize: '15px',
  width: '350px',
  showOnlyTheLastOne: true,
});

const API_KEY = '21713513-de4fa038d3971b80a05884d99';

let inputValue = '';
let page = 1;

refs.button.style.display = 'none';

export const getSubmitForm = e => {
  e.preventDefault();
  clearGallery();
  page = 1;
  inputValue = e.target.elements.query.value;
  if (inputValue.length === 0) {
    return Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }

  if (inputValue.length) {
    apiService(inputValue, page, API_KEY)
      .then(images => {
        images.length > 0
          ? (refs.button.style.display = 'block')
          : (refs.button.style.display = 'none');
        markupTpl(images);
        Notiflix.Notify.success(`Cool! We found many popular images.`);
      })
      .catch(error => console.log('Oops, something went wrong', error.message));
  }
};

function clearGallery() {
  refs.galleryList.innerHTML = '';
}

export const moreImages = () => {
  page += 1;
  scrollPage();
  apiService(inputValue, page, API_KEY)
    .then(images => {
      markupTpl(images);
    })
    .catch(error => caonsole.log('Something went wrong', error.message));
};

export default function onOpenModal(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const instance = basicLightbox.create(`<img src="${event.target.dataset.src}" alt="" />`);
  instance.show();
}

refs.galleryList.addEventListener('click', onOpenModal);
refs.form.addEventListener('submit', getSubmitForm);
refs.button.addEventListener('click', moreImages);

function scrollPage() {
  try {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 1000);
  } catch (error) {
    console.log('Something went wrong', error.message);
  }
}
