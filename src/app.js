import './assets/styles/main.scss';

import Bot from './Bot';

let lary;

const chatForm = document.getElementById('chat-form'),
    chatTextArea = document.getElementById('message-input'),
    messageZone = document.getElementById('messages');

/* Подписка на сообщения бота
* TODO: переделать, возможно на Observable */
window.addEventListener('botSpeak', event => {
    addMessage(messageZone, event.detail, 'Lary');
});

lary = new Bot('Lary');

/* "отправка" сообщений боту */
chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = chatTextArea.value;
    addMessage(messageZone, message, 'Вы', true);

    chatForm.reset();
    lary.acceptPhrase(message);
});

/**
 * Добавление сообщение в чат
 * @param elem
 * @param message
 * @param user
 * @param isYou
 */
function addMessage(elem, message, user, isYou = false) {
    const newMessage = document.createElement('li');
    newMessage.innerHTML = `<b>${user}:</b><br/> ${message}`;
    let classes = isYou ? 'is-user' : 'is-bot';
    newMessage.classList.add(classes);
    elem.appendChild(newMessage);
    elem.scrollTop = elem.scrollHeight;
}
