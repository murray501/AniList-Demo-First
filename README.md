## Demo

[http://affectionate-elion-5bfadb.netlify.app](http://affectionate-elion-5bfadb.netlify.app)

### For localhost

1. npm install
2. npm start
3. open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to use?

1. Select `Anime` or `Manga`. Data is fetched accordingly from Anilist.
2. Select `Popularity` or `Trending`. Data is sorted accordingly.
3. Click item on the list. Detail is shown on the right side.
4. Click `Description` button. Its description is shown below.
5. Click `Character` button. Its characters are shown below.
6. Click list item on character list. Its character description is shown on the right side. 

**Note: All fetched data are saved on local storage. Data can be obsolete. You need to clear `local storage` using dev tools in the browser.

## Implementation

1. GraphQL. AniList API is used.  [https://anilist.gitbook.io/anilist-apiv2-docs/](https://anilist.gitbook.io/anilist-apiv2-docs/)
2. React Router is used for pages.
3. Data is saved on local storage.  
