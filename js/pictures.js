'use strict';
const picturesContainer = document.querySelector('.pictures');

const similarPhotoTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const QUANTITY_LIKES_MIN = 15;
const QUANTITY_LIKES_MAX = 201;

const DESCRIPTIONS_PHOTO = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

const COMMENTS_PHOTO = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают.',
  'Как можно было поймать такой неудачный момент?!'
];

const QUANTITY_LINE_COMMENT_MIN = 1;
const QUANTITY_LINE_COMMENT_MAX = 3;
const QUANTITY_COMMENTS_MIN = 1;
const QUANTITY_COMMENTS_MAX = 2;

const AMOUNT_PHOTOS = 25;


/**
 * @param {Array} array
 * @returns {Number}
 */
const getRandomIndex = function (array) {
  if (array.length === 0) {
    throw new Error('The `array` argument must contain at least one element');
  }
  return Math.floor(Math.random() * array.length);
};

/**
 * Рандомное число от min(включительно) до max(не включая)
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
const getRandomInteger = function (min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
};

/**
 * Создает рандомный комментарий из 1 или 2 строк
 */
const getComment = function () {
  let comment;
  if (getRandomInteger(QUANTITY_LINE_COMMENT_MIN, QUANTITY_LINE_COMMENT_MAX) > 1) {
    comment = COMMENTS_PHOTO[getRandomIndex(COMMENTS_PHOTO)];
  } else {
    comment = COMMENTS_PHOTO[getRandomIndex(COMMENTS_PHOTO)] + ' ' + COMMENTS_PHOTO[getRandomIndex(COMMENTS_PHOTO)];
  }
  return comment;
};

/**
 * Создает массив с несколькими комментариями
 *
 * @return {Array}
 */
const getArrayComments = function () {
  const randomNumber = getRandomInteger(QUANTITY_COMMENTS_MIN, QUANTITY_COMMENTS_MAX);
  const comments = new Array(randomNumber);
  for (let i = 0; i < randomNumber; i++) {
    comments[i] = getComment();
  }
  return comments;
};


/**
 * @param {Number} index
 * @return {Object}
 */
const createPhoto = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg',
    likes: getRandomInteger(QUANTITY_LIKES_MIN, QUANTITY_LIKES_MAX),
    comments: getArrayComments(),
    description: DESCRIPTIONS_PHOTO[getRandomIndex(DESCRIPTIONS_PHOTO)]
  }
};

/**
 * Функция заполнения данными из массива
 *
 * @param {Array} photo
 * @return {HTMLElement}
 */
const renderPhoto = function (photo) {
  const photoElement = similarPhotoTemplate.cloneNode(true);
  const pictureLikes = photoElement.querySelector('.picture__likes');
  const pictureComments = photoElement.querySelector('.picture__comments');

  pictureLikes.classList.add('picture__stat--likes');
  pictureComments.classList.add('picture__stat--comments');
  photoElement.querySelector('.picture__img').src = photo.url;
  pictureLikes.textContent = photo.likes;
  pictureComments.textContent = photo.comments.length;
  return photoElement;
};

const photos = new Array(AMOUNT_PHOTOS);
const fragment = document.createDocumentFragment();

const bigPicture = document.querySelector('.big-picture');
const socialComments = bigPicture.querySelector('.social__comments');

/**
 * @param {HTMLElement} elem
 */
const removeChildren = function (elem) {
  while (elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
};

/**
 * @param {Array} photo
 */
const fillingComments = function (photo) {
  const socialComment = socialComments.querySelector('.social__comment');
  removeChildren(socialComments);
  for (let i = 0; i < photo[0].comments.length; i++) {
    socialComment.querySelector('.social__text').textContent = photo[0].comments[i];
    socialComment.querySelector('.social__picture').src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
    socialComments.appendChild(socialComment.cloneNode(true));
  }
};

/**
 * @param {Array} photos
 * @return {HTMLElement}
 */
const showBigPhoto = function (photos) {
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = photos[0].url;
  bigPicture.querySelector('.likes-count').textContent = photos[0].likes;
  bigPicture.querySelector('.comments-count').textContent = photos[0].comments.length;
  bigPicture.querySelector('.social__caption').textContent = photos[0].description;
  fillingComments(photos);
  return bigPicture;
};

// Заполнение массива фотографий
for (let i = 0; i < photos.length; i++) {
  photos[i] = createPhoto(i);
  fragment.appendChild(renderPhoto(photos[i]));
}

picturesContainer.appendChild(fragment);
showBigPhoto(photos);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
