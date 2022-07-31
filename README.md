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
| Ukraine (uk) | ✅          | ✅      |
| Czech (cs)   | ✅          | ✅      |
| Slovak (sk)  | ✅          | ✅      |
| Polish (pl)  | ✅          | ✅      |
| English (en) | 🆘         | 🆘       |

> What to add new language? Contact us at [pryvit@movapp.cz](mailto:pryvit@movapp.cz)

## Tools

We have developed some tools to help us automate boring stuff using nodejs scripts written in Typescript.

### Development

At first install all dependencies.

```bash
npm run install
```

- We need to convert out Typescript code to nodejs Javascript using `ts-node`
  - `npm run build` Build once
  - `npm run watch` Build on changes
- We need to ensure same style of code using `npm run lint`

### AirTable to JSON data structure

- [AirTable npm docs](https://www.npmjs.com/package/airtable)
- [AirTable API - login required](https://airtable.com/appLciQqZNGDR3J6W/api/docs)
- [Process diagram](https://app.diagrams.net/#G1mYrjyU01kJwz6Tg72o2B2XFDwVJn9AhC)
- [Azure SDK](https://docs.microsoft.com/cs-cz/azure/cognitive-services/speech-service/)

### API keys

* You can set environment variables by creating a `.env` file according to `.env.example`. 
* You can also use run configurations (PHPStorm or any other IDE). Set the environment in GUI and do not store the file to the repository.
* Alternatively, you can set environment variables using the command line: 

```bash
export AIRTABLE_API_KEY=YOUR_SECRET_API_KEY
export AZURE_SUBSCRIPTION_KEY=KEY
export AZURE_REGION=REGION
```

### Running the script

```bash
npm run build:dictionary
npm run build:alphabet
```

#### Using Github actions

[![Build from AirTable](https://github.com/cesko-digital/movapp-data/actions/workflows/airtable.yml/badge.svg?branch=main)](https://github.com/cesko-digital/movapp-data/actions/workflows/airtable.yml)


1. Go to [Actions / Build from AirTable](https://github.com/cesko-digital/movapp-data/actions/workflows/airtable.yml)
2. Pres `Run workflow` on the right side above "workflow runs table" button and select `main` branch and `Run workflow`

## Using the data

### Kid's section

The movapp website and apps have a separate [vocabulary section for children](https://www.movapp.cz/kids) (and a [memory game](https://www.movapp.cz/kids/memory-game)). Phrases for these sections are stored the same way as any other phrase category. Use the `recSHyEn6N0hAqUBp` category id to retrieve the Kid's section phrases. 
