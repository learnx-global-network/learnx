initNavToggle(document.querySelector('main'));
const uniList = document.querySelector('.uni-list');
const collapsible = {
    target: document.querySelector('.sliding-collapsible'),
    state: 0,
    setProgress: function(progress) {
        this.target.style.transform = `perspective(70rem) rotateX(${progress*90}deg) translateY(-${progress*4}rem) scale(${1-progress*.1})`;
        this.target.style.height = `${this.target.scrollHeight*(Math.cos(progress*Math.PI/2))}px`;
        this.target.style.marginTop = `-${progress*1.5}rem`;
        this.state = 1;
    } 
}
function slidingClose(duration=400) {
    let initTime;
    function animate(time) {
        if(initTime===undefined) initTime = time;
        const timeElapsed = time-initTime;
        if(timeElapsed < duration) {
            collapsible.setProgress(quadInOut(timeElapsed, 0, 1, duration));
            requestAnimationFrame(animate);
        }
        else {
            collapsible.target.style.transform = 'perspective(70rem) rotateX(90deg) translateY(-4rem) scale(.9)';
            collapsible.target.style.height = '0px';
            collapsible.target.style.marginTop = '-1.5rem';
            collapsible.state = 2;
        }
    }
    requestAnimationFrame(animate);
}
function slidingOpen(duration=400) {
    let initTime;
    function animate(time) {
        if(initTime===undefined) initTime = time;
        const timeElapsed = time-initTime;
        if(timeElapsed < duration) {
            collapsible.setProgress(quadInOut(timeElapsed, 1, -1, duration));
            requestAnimationFrame(animate);
        }
        else {
            collapsible.target.style.transform = 'perspective(70rem) rotateX(0) translateY(0)';
            collapsible.target.style.height = `${collapsible.target.scrollHeight}px`;
            collapsible.target.style.marginTop = '0';
            collapsible.state = 0;
        }
    }
    requestAnimationFrame(animate);
}
uniList.addEventListener('scroll', ()=>{
    if(collapsible.state == 1) return;
    if(uniList.scrollTop > 120) {
        if(collapsible.state == 2) return;
        else slidingClose();
    }
    else {
        if(collapsible.state == 0) return;
        else slidingOpen();
    }
});

const map = L.map('map', {
    zoomControl: false,
    maxBounds: [[90, 186],[-80,-174]]
}).setView([20, 6], 2);
const tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 18,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);
L.control.zoom({position: 'bottomright'}).addTo(map);
const icon = L.icon({
    iconUrl: './img/pinPoint.svg',
    iconSize: [25, 30.25],
    iconAnchor: [12.5,30.25],
    popupAnchor: [0,-30.3]
})
fetch('./json/istitutes.json')
.then(file=>{
    file.json()
    .then(data=>{
        data.forEach(element => {
            const marker = L.marker([element.latitude, element.longitude], {title: element.name, icon: icon}).addTo(map);
            marker.bindPopup(`<b>${element.name}</b><br>${element.country}`)
            const li = document.createElement('li');
            li.classList.add('istitute');
            li.innerHTML = `<h3 class="istitute__title" data-country="${element.country}">${element.name}</h3>
                            <p class="istitute__desc">${element.description}</p>
                            <div class="istitute__links">
                                <a href="interviews.html#i-${element.id}" class="btn--alt">LearnX interviews</a>
                                <a href="${element.website}" target="_blank" rel="noopener" class="btn">Their website</a>
                            </div>
                            <button class="istitute__pin" title="See ${element.name} on the map" onclick="moveView(${element.latitude}, ${element.longitude})">
                                <svg viewBox="0 0 10 12.0711"><circle cx="5" cy="5" r="5" fill="currentColor"/><polygon points="5,5 8.535533906,8.535533906 5,12.07106781 1.464466094,8.535533906" fill="currentColor"/><circle cx="5" cy="5" r="1.75" fill="white"/></svg>
                            </button>`
            uniList.appendChild(li);
        });
    })
    .catch(err=>{console.log(err); alert('Something went wrong');})
})
.catch(err=>{console.log(err); alert('Something went wrong');});

if(window.innerWidth < 900) {
    function closeMapOnTouch(e) {e.preventDefault(); window.location.hash='';}
    const mapContainer = document.querySelector('.map-container');
    const context = document.querySelectorAll('header, ul.uni-list');
    window.addEventListener('hashchange', ()=>{
        if(window.location.hash == '#map') {
            mapContainer.classList.add('show');
            context.forEach(el=>{el.addEventListener('touchend', closeMapOnTouch)});
        }
        else {
            mapContainer.classList.remove('show');
            context.forEach(el=>{el.removeEventListener('touchend', closeMapOnTouch)})
        }
    })
}

function moveView(lat, lng) {
    if(!isFinite(lat) || !isFinite(lng)) return;
    const LatLng = [lat,lng];
    if(map.getCenter().distanceTo(LatLng) < 5000) map.setView(LatLng, 15);
    else map.flyTo(LatLng, 15, {duration: 2});
    if(window.innerWidth < 900) window.location.hash = 'map';
}

const countryBounds = {
    world: L.latLngBounds([90, 186],[-80,-174]),
    qatar: L.latLngBounds([24.459986, 52.231436],[26.251514, 50.310799]),
    usa: L.latLngBounds([50.100746, -129.380318],[24.410405, -66.517903]),
    korea: L.latLngBounds([33.975230, 125.124610],[38.774008, 130.098437])
}
document.getElementById('country').addEventListener('change', e=>{
    if(!countryBounds.hasOwnProperty(e.target.value)) return;
    const bounds = countryBounds[e.target.value];
    map.setMaxBounds(countryBounds.world).flyToBounds(bounds, {duration: 1});
    setTimeout(()=>{
        map.setMaxBounds(bounds);
    }, 1001);

    // should ask theb server for only the istitutes 
})