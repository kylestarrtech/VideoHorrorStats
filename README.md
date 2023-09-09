# Video Horror Stats

## Overview
This is the official repository for the now unmaintained *Video Horror Society* fan project titled **Video Horror Stats** (once https://videohorrorstats.com/) it was a site for the 4v1 asymmetrical game *Video Horror Society* that detailed all of the internal numbers and details surrounding monsters in the game, weapons, teens, perks, and more.

This project was meant to be continuously updated throughout the game's lifespan, but due to the project's overall workload and some actions of Hellbent Games to a friend of mine, I made the tough decision to sunset the project as a whole.

## Preparation

To run this locally, I *highly recommend* deleting the "node_modules" folder. I did not have this folder gitignored as I was only using one computer to work on the project, and I originally did not intend on making the project open-source.

This project is *very* simple in its stack, so the steps to prepare for a launch are also similarily simple.  So here are the things you should know to get started:

1. If you don't have it already, download Node.js. Video Horror Stats uses Node.js v18.15.0, but it should work on other versions quite universally for the forseeable future.
2. Fork/Clone the repository
3. Delete the "node_modules" folder to facilitate a fresh install of the used packages.
4. Run `npm install` to get an update on all of the packages.

## Launching

Launching is as simple as one single command. Simply type `node server.js` and within a few seconds if you have everything configured properly like above you should see the message *"Video Horror Stats is online! Listening on port {port}!"* (With {port} being the port chosen in the `server.js` file, with the default being 3000).

## Conclusion and Disclaimers

This project was a heavy passion project of mine.

You may notice unfixed bugs or errors, and you may notice sloppy clientside code. This project was not only made of love, but was also made of popsicle sticks and marshmallows by a guy who was still learning a lot of this stuff at the time, remember this project began back in the Closed Beta well over a year ago.

Anyways, please feel free to peruse. This repository also has a lot of other assets from *Video Horror Society* I was using on the site.

Be kind, and rewind.
 - Kyle

 ## Copyright
 
 All assets from *Video Horror Society* used on this site are the property of *Hellbent Games* and are used transformatively for this fan project.