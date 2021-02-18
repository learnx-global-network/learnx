# LearnX global network site prototype, by Fedesky25
See the [preview](https://fedesky25.github.io/learnx-site-prototype/). Features:
* All html files in same folder
* All js, css, images in their respective folders
* No dependencies, so no external library that need more HTTP requests and several hundread KB download (with the exception of leaflet required to rendere a map of all universities involved)
* Less template => more unique ;-)
* Universities and interviews pages constructed locally by the frontend, which means no need of backend rendering

## Doubts / desires
* Side navigation bar: now uses icons on wide screen, while on mobile a button toggles a menu. Is it too far off from being easily recognizable?
* It would be cool to put the SVG of the logo as water mark;

## Universities page
This page displays universities and colleges involved in LearnX project. It provides a list of istitutes that changes depending on:
* the restriction of country done throth a dropdown menu,
* the user text seach for a istitute name.

In order to fully function, a server is needed to fetch the user requests and searches. The server should respond in a similar way in which `json/istitutes.json` is structured in order to provide the user and the page:
* ID and name of the university / college;
* Location of the istitute, specifying both the country and the exact geographic coordinates (latitude and longitude);
* A quickly-readable, representative, extract from the istitute website;
* A link to the istitute website.

## Interview page
This page should only be referenced with an hash having the id of a specific university/college since it should only display interviews of students applied at a specific istitute (for example, `interviews.html#i-184` to reference the istitute with id 184). The page with valid id will require all the podcasts info - description, timestamps, id of youtube video, student info such as name, class, title, subject - which then it displays.
The files located in the folder `json/istitutesData/` are representative of how the response from the server (regarding a specific university / college) should be, but aren't a suggestion of how to structure the database. 
There are two layout options for the page:
* `interviews.html`: the original layout is good and responsive but becomes quickly heavy due to the fact that it loads potentially several embedded documents (i.e. video players) inside many iframes. It may be fixed by loading only podcasts in view, but the overall experience can worsen by doing so.
* `alt_intervies.html`: the alternative layout is lighter, keeps aligned and centered in "fullscreen" (via a subtle snapping effect) video and podcast info, leaving much more space for the description and, more importantly, the list of useful timestamps. While it works best on wide screens, on the downside it isn't much responsive and requires a different solution to adapt to the mobile viewport.

## Feedback
Tell me what you think about it.