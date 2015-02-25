# Facebook Events

This is a skill demonstration for [Facebook](http://www.facebook.com/) Company.
View [Demo online](http://syrusakbary-codechallenges.github.io/facebook-events/)
[Test it online](http://syrusakbary-codechallenges.github.io/facebook-events/test.html)

## Technology

### What this project is using

 * Javascript ES6 - Harmony
 * [React.js](http://facebook.github.io/react/)
 * [Webpack](http://webpack.github.io/)
 * [Modernizr](http://modernizr.com/) through [browsernizr](https://www.npmjs.com/package/browsernizr)
 * [Mocha](http://mochajs.org/) for Testing


## Notes

* I could do **js inline styling** as Christopher Chedeau (Vjeux) suggested in [react-css-in-js](https://speakerdeck.com/vjeux/react-css-in-js), but I do not want to scare the interviewer.
* I could use **atom css**, but there are very few elements with shared styles so make no sense.
* I didn't choose **reflux** architecture because I want to keep it simple!
* Also I could use some **css preprocessor**, as avoids code repetition (like duplicated css-properties or keyframes for each browser engine), but I want to keep the project simple. The less, the better.


### Caveats

The app **needs js** to render the basic event calendar.
If we require to have the events previously rendered in html (for SEO reasons) I would *choose other strategy*.

Would be possible to create the columns using HTML markup (when are already separated using mapevent.columize), but the current solution avoids unnecesary markup and is better for handling the animations, as all the events are in the same DOM level (have the same parent element).


### Extras

* Added events layout animation
* Added ability to add random event
* Added ability to remove events by clicking in the *X* icon in the event layout
* The event calendar properties (width, height, start hour, end hour) could change dinamically. So we are not tied to certain width, height.


## Develop / build

# How to compile

The following command will compile the resources into /dist/app.js and /dist/test.js (testing)

```shell
npm run deps # Install dependencies and run webpack
```

# Development Server

The following command will start a developing server that will reload automatically the page in the browser when the code changes.

```shell
npm run dev-server # Install dependencies and run webpack
```

And now open [localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) and voilá!
