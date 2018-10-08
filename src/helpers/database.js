const storage = window.localStorage;

import FuzzySet from 'fuzzyset.js';

export default class DataBase {
    constructor() {
        this.dictionary = JSON.parse(storage.getItem('dictionary')) || [];
        this.fuzzySet= FuzzySet(this.dictionary.map(i => i.key));
    }

    find(phrase) {
        return new Promise((resolve, reject) => {
            let fuzzyResult = this.fuzzySet.get(phrase,false, 0.5);
            if (!fuzzyResult) {
                reject({CODE: 'NOT_ANSWERS'})
            } else {
                let [percent, key] = fuzzyResult.sort((a,b) => b[0] - a[0])[0];
                if (percent === 0) reject({CODE: 'NOT_ANSWERS'})
                let result = this.dictionary.find(p => p.key === key);
                resolve({percent, result});
            }
        })
    }

    save() {
        storage.setItem('dictionary', JSON.stringify(this.dictionary));
    }

    /**
     * Добавление нового ответа
     * @param key
     * @param answer
     */
    addAnswer(key, answer) {
        this.dictionary.push({key, answer});
        this.fuzzySet.add(key);

        this.save();
    }
}
