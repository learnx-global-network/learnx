const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const players = [];
function onYouTubeIframeAPIReady() {populate()}
// document.querySelectorAll('.podcast__timestamps button[data-time]').forEach(el=>{
//     el.addEventListener('click', e=>{
//         player1.seekTo(parseInt(el.getAttribute('data-time')));
//         player1.playVideo();
//     })
// })

// water mark handler
const water = document.querySelector('.water');
let ticking = false;
document.addEventListener('scroll', ()=>{
    if(!ticking){
        requestAnimationFrame(()=>{
            water.style.bottom = `${window.scrollY/120}rem`
            ticking = false;
        })
        ticking = true;
    }
})

Number.prototype.toMMSS = function () {
    const rem = this % 60;
    if(rem>10) return `${Math.floor(this/60)}:${rem}`;
    else return `${Math.floor(this/60)}:0${rem}`;
}

const mainBody = document.getElementById('mainBody');
function populate(){
    fetch('./js/interviewsData.json')
    .then(file=>{
        file.json()
        .then(data=>{
            //console.log(data);
            data.forEach((doc,index)=>{
                const article = document.createElement('article');
                if(index % 2 == 0) article.classList.add('podcast');
                else article.classList.add('podcast--reverse');
                const html = []
                html.push(`<div class="podcast__content"><h3 class="podcast__title">${doc.istitute}</h3><h4 class="podcast__subtitle">Interview with ${doc.studentName}</h4><p class="podcast__desc">${doc.description}</p><ul class="podcast__timestamps">`);
                doc.timestamps.forEach(time=>{
                    html.push(`<li><button type="button" onclick="players[${index}].seekTo(${time.time});" data-time="${time.time.toMMSS()}">${time.label}</button></li>`);
                })
                html.push(`</ul></div><div class="podcast__video"><div class="aspect-ratio"><iframe id="pc${index}" src="https://www.youtube.com/embed/${doc.videoID}?enablejsapi=1" frameborder="0" allow="fullscreen"></iframe></div></div>`);
                article.innerHTML = html.join('');
                mainBody.appendChild(article);
                setTimeout(()=>{players.push(new YT.Player(`pc${index}`, {}));}, 100);
            })
        })
        .catch(err=>{
            console.log(`Error in JSON parsing: ${err}`);
        })
    })
    .catch(err=>{
        console.log(`Error in fetching data: ${err}`);
    });
}