const translate = require('google-translate-api-x');
console.log('translator is running');

//! One huge piece of garbage code. Unnused now, translations are made in the main file

const res = async () => {}
    try {
        let a = await translate('Ik spreek Engels', {to: 'en', client: 'gtx', forceBatch: false})
        console.log(a);
    } catch (error) {
        console.log(error);
    }
}

async function RU (text) {
    try {
        let result = await translateText(text, { to: 'en', client: 'gtx', forceBatch: false })
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function EN (text) {
    try {
        let result = await translateText(text, { to: 'ru', client: 'gtx', forceBatch: false })
        return result
    } catch (error) {
        console.log(error);
    }
}

module.exports = {RU, EN}