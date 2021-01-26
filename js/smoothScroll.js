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