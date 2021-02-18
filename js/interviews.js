window.addEventListener('hashchange', ()=>{
    if(!window.location.hash.startsWith('#i-')) window.location.replace('./universities.html');
    else populate();
})

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const players = [];
function onYouTubeIframeAPIReady() {populate()}

// init water mark
initWaterMark(120);
setAnchors(20);
initNavToggle(document.querySelectorAll('header, main, footer'));

Number.prototype.toMMSS = function () {
    const rem = this % 60;
    if(rem>10) return `${Math.floor(this/60)}:${rem}`;
    else return `${Math.floor(this/60)}:0${rem}`;
}

const mainBody = document.getElementById('mainBody');
function populate(){
    fetch(`./json/istitutesData/${window.location.hash.substr(1)}.json`)
    .then(res=>{
        if(!res.ok) {
            console.log(res.status, res.statusText);
            window.location.replace('./universities.html');
            return;
        }
        res.json()
        .then(data=>{
            //console.log(data);
            data.forEach((doc,index)=>{
                const article = document.createElement('article');
                if(index % 2 == 0) article.classList.add('podcast');
                else article.classList.add('podcast--reverse');
                const html = []
                html.push(`<div class="podcast__content"><h3 class="podcast__title">Interview with ${doc.student.name}</h3><h4 class="podcast__subtitle">`);
                if(doc.student.class) html.push(`Class of ${doc.student.class} | `);
                html.push(`${doc.student.title} in ${doc.student.subject}</h4>`);
                if(doc.desc) html.push(`<p class="podcast__desc">${doc.desc}</p>`);
                html.push('<ul class="podcast__timestamps">');
                doc.timestamps.forEach(time=>{
                    html.push(`<li><button type="button" onclick="players[${index}].seekTo(${time.time}); players[${index}].playVideo();" data-time="${time.time.toMMSS()}">${time.label}</button></li>`);
                })
                html.push(`</ul></div><div class="podcast__video"><div class="aspect-ratio"><iframe id="pc${index}" src="https://www.youtube.com/embed/${doc.videoID}?enablejsapi=1" frameborder="0" allow="fullscreen"></iframe></div></div>`);
                article.innerHTML = html.join('');
                mainBody.appendChild(article);
                setTimeout(()=>{players.push(new YT.Player(`pc${index}`, {}));}, 100);
            })
        })
        .catch(err=>{
            alert(err);
            window.location.replace('./universities.html');
        })
    })
    .catch(err=>{
        window.location.replace('./universities.html');
    });
}