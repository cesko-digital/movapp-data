# Data files for movapp.cz applications

> [cesko-digital/movapp](https://github.com/cesko-digital/movapp)
> / [cesko-digital/movapp-apple](https://github.com/cesko-digital/movapp-apple)

Source is under MIT license. Texts, images and audio files are
under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.cs) license.

## Why?

This repository is for opening our data files to #opensource community. Our applications copy the data files as needed.

Our data is created and updated in
Airtable ([Phrases](https://airtable.com/appLciQqZNGDR3J6W/tblDQ7VuXpW6WmPpH/viwtUJ5B0HM7Zbe6Z?blocks=hide)
and [Categories](https://airtable.com/appLciQqZNGDR3J6W/tbl99lSvZaGW2czPu/viw5DEx2It8pelQrt?blocks=hide), login required).

### Languages

We are providing translations from Ukraine to given languages

| Language     | Dictionary | Alphabet |
|--------------|------------|----------|
| Ukraine (uk) | ✅          | ✅        |
| Czech (cs)   | ✅          | ✅        |
| Slovak (sk)  | ✅          | 🆘       |
| Polish (pl)  | ✅          | 🆘       |

> What to add new language? Contact us at [pryvit@movapp.cz](mailto:pryvit@movapp.cz)

## Tools

We have developed some tools to help us automate boring stuff using nodejs scripts written in Typescript.

### AirTable to JSON data structure

- [AirTable npm docs](https://www.npmjs.com/package/airtable)
- [AirTable API - login required](https://airtable.com/appLciQqZNGDR3J6W/api/docs)
- [Process diagram](https://app.diagrams.net/#G1mYrjyU01kJwz6Tg72o2B2XFDwVJn9AhC)

```bash
export AIRTABLE_API_KEY=YOUR_SECRET_API_KEY
npm run start
```

You can also use run configurations (PHPStorm or any other IDE). Set the environment in GUI and do not store the file to the repository.
