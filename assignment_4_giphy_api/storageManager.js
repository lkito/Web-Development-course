import config from "./config.js";

class StorageManager{

    /**
     * Save option to local storage.
     * 
     * @param value Value to be saved in localstorage array
     */
    static saveOptionInLS(value){
        const optionList = JSON.parse(localStorage.getItem(config.optionList));
        optionList.push(value);
        localStorage.setItem(config.optionList, JSON.stringify(optionList));
    }

    /**
     * Delete option from local storage.
     * 
     * @param value Value to be deleted from localstorage array
     */
    static deleteOptionFromLS(value){
        let optionList = JSON.parse(localStorage.getItem(config.optionList));
        optionList = optionList.filter(e => e !== value)
        localStorage.setItem(config.optionList, JSON.stringify(optionList));
    }

    /**
     * Adds default options in local storage if it's empty
     */
    static updateOptionsInLS(){
        if(['', '[]', null].includes(localStorage.getItem(config.optionList)))
            localStorage.setItem(config.optionList, JSON.stringify(config.defaultOptions));
    }
}

export default StorageManager;