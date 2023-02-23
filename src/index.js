// import Notiflix from 'notiflix';
import axios from 'axios'

const searchQuery = document.querySelector(".search_input")
const form = document.getElementById("search-form")
const gallery = document.querySelector(".gallery")
const loadMore = document.querySelector(".load-more")
const btn =document.querySelector(".button")
let search = ""
let numberOfPage = 1

loadMore.addEventListener("click", onClickLoadMore)
form.addEventListener("submit", onSubmitForm)
searchQuery.addEventListener("input", onSearchQuery)


async function  fetchElement (search, page) { 
    const URL = `https://pixabay.com/api/?key=33801873-24bead2c15be4dcc872add6e4&${search}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
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

    fetchElement(searchQuery, numberOfPage) 
        .then(response => { 
        const foto = response.data.hits
        const totalHits = response.data.totalHits
        totalFoto = foto.length
        if (foto.length === 0) { 
            changeVisibleLoadingMoreBtn()
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        if (foto.length !== 0)   
             Notiflix.Notify.success(`Where is  ${totalHits} images.`)
        }
return createMarkupFotoData(foto)
        })
        .then(markup => { 
            galleryMarkup(markup)

        })
    .catch (error)
}
function onSearchQuery(e) { 
    searchQuery = e.target.value
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
            const totalHits = response.data.totalHits
            totalFoto += foto.length
            if (totalFoto === 0 || totalFoto >= totalHits) {
                Notiflix.Notify.warning("We have reached the end of the list")
                changeVisibleLoadingMoreBtn()
            }
             return foto
        }
    )
        .then(foto => createMarkupFotoData(foto))
        .then(markup => { 
            addMarkupToGalery(markup)
            loadMore.disabled = false
        })
    .catch (error)

}