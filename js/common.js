/**
* Smoothly scrolls to the target
* @param {HTMLElement} target target of the scrolling
* @param {Number} offset offset to apply
* @param {Number} duration duration of the scrolling
*/
function smoothScrollTo(target, offset, duration) {
    let start = window.scrollY, end = target.offsetTop - offset, delta, initialTime;
    if (end > document.body.scrollHeight - window.innerHeight) delta = document.body.scrollHeight - window.innerHeight - start;
    else if (end < 0) delta = - start; else delta = end - start;
    function animate(timeStamp) {
        if (initialTime === undefined) initialTime = timeStamp;
        const timeElapsed = timeStamp-initialTime;
        window.scrollTo(0, quadInOut(timeElapsed, start, delta, duration));
        if (timeElapsed < duration) window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate)
}
function quadInOut (t, b, c, d) {t /= d/2; if (t < 1) return c/2*t*t + b; t--; return -c/2 * (t*(t-2) - 1) + b;};
/**
 * Initialize parallax effect on water mark
 * @param {Number} ratio how much is sensible to the amount scrolled; it divides the scrolled amount (ratio=2 -> half movement)
 * @param {HTMLElement} target the target (a water mark) on which the parallax effect is applied; default is first istance of .water
 */
function initWaterMark(ratio, target=null) {
    const waterMark = target || document.querySelector('.water');
    let ticking = false;
    document.addEventListener('scroll', ()=>{
        if(!ticking){
            requestAnimationFrame(()=>{
                waterMark.style.bottom = `${window.scrollY/ratio}rem`;
                ticking = false;
            });
            ticking = true;
        }
    });
}
/**
 * initialize function to toggle the aside nav
 * @param {NodeList} context elements in context out of nav
 * @param {HTMLElement} navElement nav element; default first with class .navaside
 * @return {Function} function that toggles the nav
 */
function initNavToggle(context, navElement=null) {
    const nav = navElement || document.querySelector('.navaside');
    function closeNav() {
        nav.classList.remove('active');
        context.forEach(node=>{node.removeEventListener('touchend', closeNav)});
    }
    function toggleNav() {
        if(nav.classList.contains('active')) closeNav();
        else {
            nav.classList.add('active');
            context.forEach(node=>{node.addEventListener('touchend', closeNav)});
        }
    }
    nav.querySelector('button').addEventListener('click', toggleNav)
    return toggleNav
}
/**
 * Sets internal anchor smooth scroll
 * @param {Number} offset offset to apply
 * @param {Number} duration duration in ms; default 600ms
 */
function setAnchors(offset, duration = 600) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
        const target = document.getElementById(anchor.getAttribute('href').slice(1));
        anchor.addEventListener('click', e=>{e.preventDefault(); smoothScrollTo(target, offset, duration); anchor.blur();})
    });
}