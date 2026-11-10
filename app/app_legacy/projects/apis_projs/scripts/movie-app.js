const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';
const GENRE_API = 'https://api.themoviedb.org/3/genre/movie/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US';

const main = document.getElementById('movie-gallery');
const form = document.getElementById('form');
const search = document.getElementById('search');
let genreNames = [];

getGenresNames(); //different api call to get only the genres
getMovies(API_URL); //fetching feed movies

//promises here (just two)
function getGenresNames() {
  return new Promise((resolve, reject) => {
    fetch(GENRE_API)
      .then(res => res.json())
      .then(data => resolve(genreIdReader(data)));
  });
};

function getMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => showMovies(data.results))
    .catch(err => console.log(err));
}

//normal functions
function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, genre_ids } = movie;
        console.log(poster_path);
        console.log(movie);
        let genreids = genre_ids.map(genreID => {
          for(let elem of genreNames) {
            if(elem.id === genreID) return ` |${elem.name}| `;
          }
        });

        const movieEl = document.createElement('div');
        movieEl.classList.add('col-sm-12');
        movieEl.classList.add('col-md-4');

        movieEl.innerHTML = `
        <div class="card border-primary shadow overflow-auto" style="width: 20rem; height: 36rem">
          <img src="${IMG_PATH + poster_path}" class="card-img-top" alt="${title}" style="height:400px; object-fit: cover;">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h5 class="card-title text-info">${title}</h5>
              <span class="${coloringMovieRate(vote_average)}">&#9733;${vote_average}</span>
            </div>
            <div class="text-info pb-2">
              ${genreids.join("")}
            </div>
            <h6 class="card-title">Overview</h6>
            <p class="card-text">${overview}</p>
          </div>
        </div>
        `
        main.appendChild(movieEl);
    });
}

function coloringMovieRate(rate) {
    if(rate >= 8)
      return 'text-success';
    else if(rate >= 5)
      return 'text-warning';
    else
      return 'text-danger';
}

function genreIdReader(objIds) {
  objIds.genres.forEach(genre => {
    genreNames.push(genre);
  });
}

//event listener
form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const searchTerm = search.value;

    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)
        search.value = '';
    } else {
        window.location.reload();
    }
})