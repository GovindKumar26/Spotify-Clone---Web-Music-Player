
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
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
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
  
}

const playMusic = (track, pause = false) => {

    currentSong.src  = `/${currFolder}/`+ track
    if (!pause) {
        currentSong.play()
        console.log(track)
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums(){
      let a = await fetch(`http://127.0.0.1:3000/songs/}`)
      let response = a.text()
      let div = document.createElement("div")
      div.innerHTML = response
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
            play.src = "play.svg"

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
                console.log(currentSong)
                console.log((currentSong.src.split("/").slice(-1))[0])
                let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
                console.log(index)

                if(index+1 < songs.length){
                    playMusic(songs[index+1])
                }
    })

    prev.addEventListener("click",()=>{
        
        console.log((currentSong.src.split("/").slice(-1))[0])
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(index)

        if(index-1 >=0){
            playMusic(songs[index-1])
        }

    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume as ",e.target.value," / 100")
        currentSong.volume = parseInt(e.target.value)/100
    })

   Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}

main()