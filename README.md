# iTrakz

Self-contained bug tracking web application, design to be used in small projects where a full-fledged tracker like Jira is overkill. Allows users to create support tickets regarding bugs in active projects. All users can see and manipulate all active tickets.

# Setup and Run

This is a NodeJS project, so you have to have `nodejs` and `npm` installed on your system. If you need to install, follow [this guide](https://nodejs.org/en/download/package-manager) before installing our site.

## Clone the repository
```bash
git clone https://github.com/wyattduber/iTrakz.git
```

## Install dependencies
```bash
  cd ./backend/
  npm install
```

## Run
```bash
node ./backend/node-webserver.js
```

# Usage

After setting it up, `./backend/node-webserver.js` will initialize a local database file (a sample exists in the repository, you can delete this from ./backend/database.db) and start up a web server. By default, it opens the webserver on port 8080, so you have to navigate to `https://localhost:8090/` in a web browser.

If you want to omit the port 8080 when connecting with a web browser, you can change the port to HTTP default port 80 on line 7 of `./backend/node-webserver.js`.

If you haven't deleted the sample `database.db` file, you'll be presented with a dashboard with some sample tickets upon connecting with a web browser. You can go ahead and delete them. Navigation throughout the site is intuitive.

# Demo

This project was for CS 319 at Iowa State University during the Spring 2021 semester. I will be maintaining a demo deployment of the site at https://itrakz.wyattduber.com/ if you want to see. This is a live database and any changes to it will be persistent. There is no permission system, so anybody on the internet can manipulate the database. As you can see, a few so-called “hackers” found their way into the database, but it's really must a good example of how the tickets are made and are persistent ;)
