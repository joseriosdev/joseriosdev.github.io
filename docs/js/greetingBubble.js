import KEYS from './constantKeys.js';
import ApiCalls from './apiCalls.js';

const AVATAR_PATH = './public/images/profile_pic.jpg';
const FREEZING_LIMIT = 1;
const COLD_LIMIT = 12;
const COOL_LIMIT = 23;
const WARM_LIMIT = 31;

export default class GreetingBubble
{
    static async create(isSpanish)
    {
        const bubbleElmt = document.createElement('dialog-bubble');
        const messages = await GreetingBubble.buildMessages(isSpanish);

        bubbleElmt.setAttribute('title', isSpanish ? 'Haz click aquí' : 'Click Me');
        bubbleElmt.setAttribute('greeting', isSpanish ? '¡Hola!' : 'Hey There,');
        bubbleElmt.setAttribute('avatar', AVATAR_PATH);
        bubbleElmt.setAttribute('messages', JSON.stringify(messages));
        return bubbleElmt;
    }

    static async buildMessages(isSpanish)
    {
        const initMsg = await GreetingBubble.formatGreeting(isSpanish);

        if (isSpanish)
        {
            return [
                initMsg,
                'Este sitio fue hecho con Web Components y tiene un juego secreto.',
                'Sabías que un hombre dijo: "Yo Soy la Vida"? mucha gente le creyó, fue un mentiroso? loco? o decía la Verdad?'
            ];
        }
        return [
            initMsg,
            'This site was coded with Web Components and has a hidden game.',
            'Did you know that a man said: "I am the life"? and many people beleived Him, was he a liar? mad man? or was he saying the Truth?'
        ];
    }

    /* Falls back to a plain greeting so a dead location or weather API never blocks the header. */
    static async formatGreeting(isSpanish)
    {
        try
        {
            const { city, timezone, country } = await ApiCalls.getLocation();
            const weatherData = await ApiCalls.getWeather(city, country);
            const timeOfDay = GreetingBubble.pickTimeOfDay(isSpanish, timezone);
            const tempFeel = GreetingBubble.pickTempFeel(isSpanish, weatherData.main.feels_like);

            if (isSpanish)
            {
                return `${timeOfDay}. Espero que todo vaya bien en ${city}, se ve que está ${tempFeel} por allá.`;
            }
            return `${timeOfDay}. Hope everything goes well in ${city}, looks ${tempFeel} there.`;
        }
        catch
        {
            return isSpanish ? '¡Hola! Gracias por pasar por aquí.' : 'Hello there! Thanks for stopping by.';
        }
    }

    static pickTimeOfDay(isSpanish, timezone)
    {
        const hour = new Intl.DateTimeFormat(isSpanish ? KEYS.LANG_SPANISH : KEYS.LANG_DEFAULT,
        {
            hour: 'numeric',
            hour12: false,
            timeZone: timezone
        }).format(new Date());

        if (hour >= 5 && hour < 12)
        {
            return isSpanish ? 'Buenos días' : 'Good morning';
        }
        if (hour >= 12 && hour < 18)
        {
            return isSpanish ? 'Buenas tardes' : 'Good afternoon';
        }
        return isSpanish ? 'Buenas noches' : 'Good evening';
    }

    static pickTempFeel(isSpanish, celsiusTemp)
    {
        if (celsiusTemp < FREEZING_LIMIT)
        {
            return isSpanish ? 'helado' : 'freezing';
        }
        if (celsiusTemp < COLD_LIMIT)
        {
            return isSpanish ? 'frío' : 'cold';
        }
        if (celsiusTemp < COOL_LIMIT)
        {
            return isSpanish ? 'fresco' : 'cool';
        }
        if (celsiusTemp < WARM_LIMIT)
        {
            return isSpanish ? 'cálido' : 'warm';
        }
        return isSpanish ? 'caliente' : 'hot';
    }
}
