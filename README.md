# animal-fullstack-01
Website getting information from a MongoDB database and adding to it or manipulating it

## Summary

public contains the frontend

```html
index.html
```
shows the gallery of the animals. Hovering over an image shows their name and description and clicking on it shows extra information. Pressing the admin button redirects you to "admin.html".


```html
admin.html
```
 is a page where you can see all collections with the animals and their info and update them or delete them. On the page you can press "Insert New" to be redirected to "form.html".

```html
form.html
```
Here you can insert new animals into the database after choosing the collection you want to add to.


## Commands
You may run
```commandline
npm start ${password}
```
in your command line, on the directory of this folder, to get the server running (and avoid problems with CORS). It will automatically open [localhost:8081](http://localhost:8081/) on your browser.

You can visit [localhost:8081/view](http://localhost:8081/view) to see a json with all the collections and animals, or [localhost:8081/view/[collection name]](http://localhost:8081/view) to see an array of only that specific collection. The collection names are "Dogs", "Cats" and "Birds".


Made with Node v20.14.0