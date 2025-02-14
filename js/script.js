
// let a = await fetch("http://127.0.0.1:3000/songs/")

// a = a.json();

// console.log(a)
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00/00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

let currentSong = new Audio;


async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    const response = await a.text()


    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                        
                            <div class="info">
                                <div class="songname">${song.replaceAll("%20", " ")}</div>
                                <div class="artistname">Pink Floyd</div>
                            </div>

                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="play2.svg" class="invert" alt="">
                            </div>
                        </li>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
  return songs
}

const playMusic = (track, pause = false) => {

    currentSong.src  = `/${currFolder}/`+ track
    if (!pause) {
        currentSong.play()
      
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums(){
      let a = await fetch(`/songs/`)
      let response = await a.text();
      let div = document.createElement("div")
      div.innerHTML = response;
      console.log(div)

      let anchors  = div.getElementsByTagName("a")
      let cardContainer = document.querySelector(".cardContainer")
      let array = Array.from(anchors)
      
      for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
      

      
        if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
            let folder = e.href.split("/").slice(-2)[0]
            //get metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card">
                        <div style="padding: 0;" class="play">
                            <img src="images/greenPlay.svg" alt="">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
`

        }
      }
       //loading the pl when card is clicked
      Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0],)
        })
    })
}

async function main() {

   await getSongs("songs/ncs")
    // console.log(songs)
    playMusic(songs[0], true)
   
     displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "images/play.svg"

        }

    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
     document.querySelector(".circle").style.left = percent + "%"
           
         currentSong.currentTime = (currentSong.duration * percent )/100
        
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })
 
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    next.addEventListener("click",()=>{
               // console.log(currentSong)
            //    console.log((currentSong.src.split("/").slice(-1))[0])
                let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
                console.log(index)

                if(index+1 < songs.length){
                    playMusic(songs[index+1])
                }
    })

    prev.addEventListener("click",()=>{
        
      //  console.log((currentSong.src.split("/").slice(-1))[0])
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      //  console.log(index)

        if(index-1 >=0){
            playMusic(songs[index-1])
        }

    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume as ",e.target.value," / 100")
        currentSong.volume = parseInt(e.target.value)/100
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
    })

   
    document.querySelector(".volume >img").addEventListener("click",e=>{
        console.log(e.target.src)
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0 
        }
        else {
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10 
            currentSong.volume = 0.1
        }

    })
}

main()