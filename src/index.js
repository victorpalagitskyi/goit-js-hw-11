import Notiflix from 'notiflix';
import axios from 'axios'

const searchInput = document.querySelector(".search_input")
const form = document.getElementById("search-form")
const gallery = document.querySelector(".gallery")
const loadMore = document.querySelector(".load-more")
const btn = document.querySelector(".button")

let searchQuery = ""
let numberOfPage = 1
let totalMatches = 0

loadMore.addEventListener("click", onClickLoadMore)
form.addEventListener("submit", onSubmitForm)
searchInput.addEventListener("input", onSearchQuery)

async function  fetchElement (searchQ, page) { 
    const URL = `https://pixabay.com/api/?key=33801873-24bead2c15be4dcc872add6e4&q=${searchQ}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    return axios(URL)
}

function createMarkupFotoData(foto) {   
    return foto.map(foto => 
        `
    <div class="photo-card">
  <img src="${foto.webformatURL}" alt="${foto.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${foto.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${foto.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${foto.comments} </b>
    </p>
    <p class="info-item">
      <b>Downloads: ${foto.downloads}</b>
    </p>
  </div>
</div>
    `).join("")
}
function changeVisibleLoadingMoreBtn() {
    loadMore.classList.toggle("visible")
}
function galleryMarkup(markup) { 
    gallery.innerHTML = markup
} 
function addMarkupToGalery(markup) { 
   gallery.insertAdjacentHTML("beforeend", markup )
}

function onSubmitForm(e) { 
    e.preventDefault()
    changeVisibleLoadingMoreBtn()
    numberOfPage = 1
    btn.disabled = true


    fetchElement(searchQuery, numberOfPage) 
        .then(response => { 
        const foto = response.data.hits
            const totalHits = response.data.totalHits
             totalMatches += foto.length
        if (foto.length === 0) { 
            changeVisibleLoadingMoreBtn()
            throw Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        if (foto.length !== 0)   
             Notiflix.Notify.success(`Where is  ${totalHits} images.`)
            }
return createMarkupFotoData(foto)
        })
        .then(markup => { 
            galleryMarkup(markup)
        })
        .catch(console.log(error))

   
    
}
function onSearchQuery(e) { 
   let searchQuery = e.target.value
    if (searchQuery === "") {
        btn.disabled = true;
    }
    else { 
        btn.disabled = false;
    }   
    return searchQuery
} 
 
function onClickLoadMore(e) { 
    numberOfPage += 1
    fetchElement(searchQuery, numberOfPage)
        .then(response => {
            const foto = response.data.hits
            const totalHits = response.data.totalHits;
            totalMatches += foto.length
            if (totalMatches === 0 || totalMatches >= totalHits) {
                Notiflix.Notify.warning("We have reached the end of the list")
                changeVisibleLoadingMoreBtn()
            }
             return foto
        })
        .then(foto => createMarkupFotoData(foto))
        .then(markup => { 
            addMarkupToGalery(markup)
            loadMore.disabled = false
        })
        .catch(console.log(error))
    

}