"use strict";
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";


const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(query) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let res = await axios.get (`http://api.tvmaze.com/search/shows?q=${query}`)
  // console.log(res);
  let shows = res.data.map (result =>{
    let show = result.show

    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL
    }
  })

  return shows;

 }


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src= ${show.image} 
              alt= ${MISSING_IMAGE_URL} 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}



async function searchForShowAndDisplay() {
  const query = $("#search-query").val();
  const shows = await getShowsByTerm(query);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 

let res = await axios.get (`http://api.tvmaze.com/shows/${id}/episodes`)
// console.log (res.data);

let episodes = res.data.map (episode => {
  return {
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }
})

return episodes;
}


function populateEpisodes(episodes) { 
  // console.log(episodes);
  $episodesArea.empty();

  for (let episode of episodes) {
    let $newEpLi = $(`<li> ${episode.name}
                    (season ${episode.season} episode ${episode.number})
                  </li>`);
    
    $episodesArea.append($newEpLi)
  }
  $episodesArea.show();
}

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt){
  let showId = $(evt.target).closest(".Show").data("show-id");
  // console.log(showId);
  let episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
})