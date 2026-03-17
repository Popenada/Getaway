# Getaway

## CSE 115A - Winter 2026

### “A Flight Planner for the Unprepared Traveler”

Getaway is a fullstack web app that remedies this by being more permissive on user input, allowing for fields to be shortened or left out entirely, and by offering a wider range of options that they can use to narrow down their selection of flights.

Users are able to bookmark flights from their search for viewing later in the 'trips' window. All result flights link directly to google flights, allowing users to book the flights they find.

Getaway also offers a discovery flight algorithm, where we take your location and provide a list of potential vacation destinations at the best prices.

<img src="gifs/Flight-Search-New.gif" width="600" height="400"/>
<img src="gifs/Saved-Flights.gif" width="600" height="400"/>
<img src="gifs/Discover-Search.gif" width="600" height="400"/>

## Contributors

Sayer Harry - Product Owner\
Jarod Cardenas\
Yong Zhao\
Alfred Nguyen\
Tarun Yendrapati

The Scrum Master position rotated with each sprint. Each member held a role for at least 1 sprint.

## Installation Guide

All requirements and dependencies for the app are handled through docker. We have built a tool to simplify the process of getting the docker containers for the front and back ends built and running at the same time.

Step 1. Ensure Docker is installed and running\
Step 2. Execute start.py in the terminal\
Step 3. Follow prompts to generate environment file\
Step 4. Follow prompt to build and run containers

After the docker containers are built and confirmed running, the app can be accessed at address localhost:3000

## How to Run

After following the installation guide, the environment will already be set up and the docker containers are already built.\
Simply run start.py and follow the prompts to start the containers.\
Then, the app can be accessed at localhost:3000

## Tech Stack

### Frontend

Next.js + React: Building for frontend components and UI\
Tailwind - Styling language\
Shadcn - Styling library

### Backend

Python + Flask - Backend routing and computation\
Waitress - Production server\
Amadeus API - Access Flight Data

## Known Issues

* There is no user input field to enable date range searches
* Retry search fetches the cached search results, does not make a new search
* Use current location button on Discover Search does not stand out
* Logo on top left does not route to search page
* When using a city as origin/destination, error in fetching search details
* On Saving a flight, marks all flights with identical details as saved
* Minimum Price parameter does not do anything
* Trip Length parameter does not do anything
* On search page load, Nonstop only is true, but reset to default button sets it to false
* Taskbar is the wrong size on FAQ page
* No input on Discover Search is not properly handled
* Connecting Flights on saved trips are incorrectly marked as return flights
* MaxPrice is capped at 2000
* Discover Flight destination pool is too narrow
* Retry Search on Discover Search leads to start of search

## Lessons Learned

This project was our introduction to the professional AGILE flow of project development. As all developers do when learning a new technique, we did as many things wrong as we did right.

### What Worked

* Making full use of our scrum times to discuss issues we were having with our tasks and brainstorm a solution
* Creating new branches and working in seperate modules to avoid messy merge errors
* Peer reviewing pull requests to enforce correctness
* Documenting expected input/output structure of functions
* Being precise and descriptive with variable names
* Having dedicated time each week to work in the same space
* Being quick to reach out and respond to bugs

### What didn't work

* Pushing updates directly to main
* Assigning stories to individuals rather than tasks
* Modfying essential modules without updating the team
* Assuming that a 3rd party module will always work
* Using the first available solution without researching its viability
* Not being proactive in getting a PR reviewed and merged
