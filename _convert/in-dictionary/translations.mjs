// JSON translation files
import Basic from './basic.json' assert { type: 'json' };
import Cas from './cas.json' assert { type: 'json' };
import HromadnaDoprava from './hromadna-doprava.json' assert { type: 'json' };
import Zoo from './zoo.json' assert { type: 'json' };
import NaNakupu from './na-nakupu.json' assert { type: 'json' };
import NaUrade from './na-urade.json' assert { type: 'json' };
import Obleceni from './obleceni.json' assert { type: 'json' };
import Drogerie from './drogerie.json' assert { type: 'json' };
import Penize from './penize.json' assert { type: 'json' };
import Rodina from './rodina.json' assert { type: 'json' };
import Doctor from './doctor.json' assert { type: 'json' };
import VDomacnosti from './vdomacnosti.json' assert { type: 'json' };
import VeMeste from './vemeste.json' assert { type: 'json' };
import VeSkole from './veskole.json' assert { type: 'json' };
import VeSkolce from './veskolce.json' assert { type: 'json' };
import Dobrovolnici from './dobrovolnici.json' assert { type: 'json' };
import ZradnaSlovicka from './zradna-slovicka.json' assert { type: 'json' };

const processTranslations = (translations) => {
    return translations;
};

export const categories = [
    {
        category_name_ua: 'Основні фрази',
        category_name_cz: 'Základní fráze',
        translations: processTranslations(Basic),
    },
    {
        category_name_cz: 'Rodina',
        category_name_ua: 'Родина',
        translations: processTranslations(Rodina),
    },
    {
        category_name_ua: 'Час',
        category_name_cz: 'Čas',
        translations: processTranslations(Cas),
    },
    {
        category_name_ua: 'Громадський транспорт',
        category_name_cz: 'Hromadná doprava',
        translations: processTranslations(HromadnaDoprava),
    },
    {
        category_name_ua: 'Їдемо в зоопарк',
        category_name_cz: 'Jedeme do ZOO',
        translations: processTranslations(Zoo),
    },
    {
        category_name_ua: 'Покупки',
        category_name_cz: 'Na nákupu',
        translations: processTranslations(NaNakupu),
    },
    {
        category_name_cz: 'Na úřadě',
        category_name_ua: 'В органах влади',
        translations: processTranslations(NaUrade),
    },
    {
        category_name_cz: 'Oblečení',
        category_name_ua: 'Одяг',
        translations: processTranslations(Obleceni),
    },
    {
        category_name_cz: 'Drogerie',
        category_name_ua: 'Побутова хімія (косметика)',
        translations: processTranslations(Drogerie),
    },
    {
        category_name_cz: 'Peníze',
        category_name_ua: 'Гроші',
        translations: processTranslations(Penize),
    },
    {
        category_name_cz: 'U lékaře',
        category_name_ua: 'У лікаря',
        translations: processTranslations(Doctor),
    },
    {
        category_name_cz: 'V domácnosti',
        category_name_ua: 'Вдома',
        translations: processTranslations(VDomacnosti),
    },
    {
        category_name_cz: 'Ve městě',
        category_name_ua: 'У місті',
        translations: processTranslations(VeMeste),
    },
    {
        category_name_cz: 'Ve škole',
        category_name_ua: 'У школі',
        translations: processTranslations(VeSkole),
    },
    {
        category_name_cz: 'Ve školce',
        category_name_ua: 'У дитсадку',
        translations: processTranslations(VeSkolce),
    },
    {
        category_name_cz: 'Dobrovolníci',
        category_name_ua: 'Добровольці',
        translations: processTranslations(Dobrovolnici),
    },
    {
        category_name_cz: 'Zrádná slovíčka',
        category_name_ua: 'Слова із іншим значенням',
        translations: processTranslations(ZradnaSlovicka),
    },
];
