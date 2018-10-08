import DataBase from './helpers/database';

const
    WAIT_PHRASE = 1,
    WAIT_ANSWER = 2,
    WAIT_CONFIRM = 3;

export default class Bot {
    constructor(name) {
        this.name = name;
        this.DB = new DataBase();
        this.status = WAIT_PHRASE;
        this.lastPhrase = '';
        this.sendMessage(`Привет всем в этом чатике! меня зовут ${this.name}`);
    }

    setSubscribe() {

    }

    /**
     * Получение фразы для бота
     * @param phrase
     */
    acceptPhrase(phrase) {
        if (this.status === WAIT_PHRASE) {
            this.findAnswer(phrase).then(data => {
                if (data.percent === 1) {
                    this.sendMessage(`${data.result.answer}`);
                } else {
                    this.sendMessage(`Возможно вы имели ввиду: ${data.result.key}`);
                    this.lastPhrase = data.result.key;
                    this.status = WAIT_CONFIRM;
                }
            }).catch(error => {
                if (error.CODE === 'NOT_ANSWERS') {
                    this.lastPhrase = phrase;
                    this.requestRightAnswer();
                } else {
                    this.sendMessage(`Повторите вопрос`);
                }
            });
        } else if (this.status === WAIT_CONFIRM) {
            if (phrase.toLowerCase() === 'да') {
                this.status = WAIT_PHRASE;
                this.acceptPhrase(this.lastPhrase);
            } else {
                this.requestRightAnswer();
            }
        } else {
            // Добавить ответ в словарь
            this.DB.addAnswer(this.lastPhrase, phrase);
            this.sendMessage(`Спасибо! Буду знать`);
            this.status = WAIT_PHRASE;
        }
    }

    /**
     * Поиск наиболее подходящего ответа
     */
    findAnswer(phrase) {
        return this.DB.find(phrase);
    }

    /**
     * Запрос дать верный ответ в случае не нахождения полного соответсвия
     */
    requestRightAnswer() {
        this.sendMessage(`Я не знаю :( Скажите верный ответ:`);
        this.status = WAIT_ANSWER;
    }

    /**
     * Отправка сообщений
     */
    sendMessage(message) {
        let speakEvent = new CustomEvent('botSpeak', {detail: `${message}`});
        dispatchEvent(speakEvent);
    }
}
