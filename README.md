# Datové soubory pro aplikaci Movapp.cz

> [cesko-digital/movapp](https://github.com/cesko-digital/movapp) / [cesko-digital/movapp-apple](https://github.com/cesko-digital/movapp-apple)

Zdrojový kód je pod MIT licencí. Texty, obrázky a audiosoubory jsou pod licencí [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.cs).

## Struktura dat

- Mobilní aplikace používá vygenerované `id`
- Mobilní aplikace používá 1:1 datové struktury (názvy souborů, názvy proměnných a další)
- TODO

## Správa dat - data z webu (dočasné)

> Ve složce _convert spouštějte `node normalize.mjs`

**V této chvíle již není aktuální a je nutné upravit na nový formát webu**

### Slovíčka

- Vyexportovat z webu movapp obsah do `in-dictionary`
- Převést `translations.ts` na `translations.mjs` + odebrat Typescript definice
  - `processTranslations` -> ať vrací rovnou translations
  - odstranit `: Category[] `
  - nahradit `.json';` za ` .json' assert { type: 'json' };`
- Spustit `node normalize.mjs`
- Přesunout `sections.json` a `translations.json` do `Assets`

## in-*.mjs

- Jedná se o ruční kopii ts skriptů s def. abecedy. Názvy souborů jsou zkopírovány do '' textu - IDE pak hodí řádky.
- Exportovat `alphabet` a `fileList`
- soubory dát do `in-{lang}-alphabet`
