# [Panther.audio](http://panther.audio)
### Discover new music through an infinite suggestion graph

-------

[Panther](http://panther.audio) is a full-stack React/Redux/Node web app that uses the Spotify API to make suggestions based on an initial user-specified artist.

It uses a graph consisting of vertices and edges to represent the data. At the center, the user's currently-selected artist, along with the artist's avatar and some audio samples of the artist's top tracks. To the left is a vertex representing the previous artist, and to the right are 3 suggestions. By clicking on the vertices, users can move forwards and backwards through their suggestion tree, (hopefully) discovering a bunch of awesome new music.

This project is a fun side-project, and is not a serious endeavor. I've not tested its browser compatibility and have not had time to fix some issues on mobile :)

 --------

## Tools of the Trade

  * [React.js](https://facebook.github.io/react/)
  * [Redux](https://github.com/reactjs/redux)
  * [Redux Saga](https://github.com/yelouafi/redux-saga)
  * [Redux Sounds](https://github.com/joshwcomeau/redux-sounds)
  * [The Duck pattern](https://github.com/erikras/ducks-modular-redux) (ish)
  * [Node.js](https://nodejs.org/en/)
  * [Express](http://expressjs.com/)
  * [RethinkDB](https://www.rethinkdb.com/)

The app is written in ES6-ES7+, transpiled with [Babel](https://babeljs.io/), and bundled with [Webpack](https://webpack.github.io/).

---------

## Technical Hurdles

### Complex UI Logic

The most challenging part of this project was coordinating and animating the sequence of events that happen when a user clicks a related artist:

* The current artist details (avatar, sample tracks) need to be transitioned out.
* The non-clicked vertices need to shrink and fade away
* A request needs to be made to Spotify to fetch the sample tracks for the newly-selected artist
* Another request needs to be made to Spotify to fetch this newly-selected artist's related artists
* A loading indicator has to be enabled, if trips to Spotify are required
* The loading indicator needs to be removed when the trips return
* The edges that connect to those vertices need to retract, but only after the vertices have been removed.
* The entire graph needs to shift over 1 position to the left, with the edges rotating as needed to move with the vertices
* The artist avatar and tracks need to have their data swapped, and transition in
* The newly-fetched related artist vertices need to grow into view
* The edges connecting to these new vertices need to expand

I also didn't want this flow to be strict. If a user clicks a _previous_ artist node, I shouldn't need to create a whole new workflow for it.

The solution I came up with was to have Redux Saga tackle the API requests and overall app state (like whether the app is "loading" or not). Everything else is a simple function of state.

The Graph component is handed a new state when the selected artist changes. Redux doesn't concern itself at all with this orchestration; it just makes the necessary changes to the Graph state and passes it along.

The component then works in 3 steps:

* Reject any nodes that haven't been clicked
* Reposition the graph so that the clicked node moves to the center.
* Introduce any new nodes

This flow works _in either direction_: When clicking previous nodes, it follows the same generic steps to transition from left to right.

##### The burden of async
There's a problem, though. When going forwards, the animation needs to start before I have all the information.

Specifically, when a related artist is clicked, I need to start moving that node to the center immediately, _even though I don't have all the data I need about it yet_. I need to know its related artists, and I need to populate its audio samples.

Because of this, in most cases*, the flow outlined above runs twice:

* In the first run, the props are diffed and it is discovered that we have a newly-selected vertex, so we need to reject the unselected vertices, and reposition the graph. We do not yet have any related artists, though, so the third step is skipped.
* Once Spotify returns all the info we need, the process runs again. The selected node has not changed, so steps 1 and 2 are skipped. Step 3 detects that we have new edges and vertices that need to be added, though, so they are animated.

\* Note that this only happens in 2 stages when we need info from the API. When moving backwards in time, or when viewing artists we already have cached, it can be done in a single pass.



#### Animations

The graph's primary animation, when transitioning from one vertex to another, was a big challenge. Initially, I had set the vertices as plain `div` elements, and used React Flip Move to calculate their change in position. This did not work for the edges, though; They don't simply need to move from one position to another, they need to change shape as the line rotates and translates.


In the final version, the graph is one big SVG, which contains `circle`s for the vertices and `line`s for the edges. The strategy I employed was very similar to that of the FLIP technique, but with the special SVG properties.

The first thing I needed to know was where every vertex will be positioned, using their `x` and `y` coordinates, calculated from the top left of the screen. I cut the screen into 3 on-screen regions: PAST, PRESENT, and FUTURE (there is also GRAVEYARD and CATACOMBS, but those are both off-screen. They're needed so that edges don't just disappear once their vertex goes off-screen). I decided where exactly the 5 on-screen vertices should be. For example, the PAST vertex should be vertically centered, and horizontally 1/6th of the screen from the left:

```
| o | _ | _ |
^ ^ ^ ^ ^ ^ ^
0 1 2 3 4 5 6
```

Using `window.innerWidth` and `window.innerHeight`, I figure out the number of pixels from the top left of the screen to its appropriate position, and I do this for all "slots" for the regions. Then, it was simply a matter of figuring out which region and position the vertex is being moved to in the next set of props.

Once I have both the initial position and the final position, I use `requestAnimationFrame` to transition the vertex's `x` and `y` coordinates.

The edges work in a similar way. Lines have four coordinates, instead of two: x1/y1 and x2/y2, but these coordinates correspond to the vertex centers, so the calculation is the same.

## Final Thoughts

This project was made so much easier by React/Redux. There are so many fiddly bits, potential timing issues, and edge cases that trying to account for all possible state permutations would have been impossible. Instead, I can make the views simply a representation of state; they just render whatever Redux tells them to without worrying about trying to account for all the changes.
