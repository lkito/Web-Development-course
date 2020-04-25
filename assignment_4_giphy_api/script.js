import config from "./config.js";

class Search {
    
    /**
     * Costructor. Memorizes data source and API key.
     * 
     * @param url string of url of the data source
     * @param trendingUrl string of url of the trending gifs data source
     * @param apiKey API key for the data source
     * @param limit maximum number of objects that should be fetched.
     */
    constructor(url, trendingUrl, apiKey, limit){
        this._url = url;
        this._trendingUrl = trendingUrl;
        this._apiKey = apiKey;
        this._limit = limit;
        this._addOptionsFromLocalStorage(); // Load stored options
    }

    /**
     * Fetch data by text entered in input field.
     * Called when input button is pressed.
     * 
     * @param query Text to search by from input.
     */
    async searchByInput(query){
        const resultElem = document.getElementById('search-results');
        if(query == ''){ // Return no results if query is empty
            resultElem.innerHTML = '';
            return;
        }
        const data = await this._pullData(query);
        this._drawResult(data, resultElem);
    }

    /**
     * Fetch trending gifs.
     * Called when trending button is pressed.
     */
    async searchTrending(){
        const resultElem = document.getElementById('search-results');
        const data = await this._pullData('');
        this._drawResult(data, resultElem);
    }

    /**
     * Adds passed option to options. if Empty, gets value from search bar.
     * Called when Submit button is pressed or during page load, when adding options from localstorage.
     * 
     * @param query name of new option.
     */
    addOption(query=''){
        if(query == ''){ // If Empty, gets value from search bar.
            query = document.getElementById('search-field').value;
            if(query == '') return;
            this.searchByInput(query); // Search for result even if option is already saved
            // Check if we already have this option
            if(JSON.parse(localStorage.getItem(config.optionList)).includes(query)) return;
            this._saveOptionInLS(query);
        }

        const resultElem = document.getElementById('search-options');
        const wrapper = document.createElement('div'); // Wrapper element
        wrapper.className = 'item--search-wrapper';

        const curNode = document.createElement('input'); // Option button
        curNode.type = 'button';
        curNode.addEventListener('click', callSearchRemotely, false);
        curNode.className = 'btn item--search search-option';
        curNode.value = query;

        const deleteButton = document.createElement('input'); // Option delete button
        deleteButton.type = 'button';
        deleteButton.addEventListener('click', callDeleteRemotely, false);
        deleteButton.className = 'btn item--search__delete';
        deleteButton.value = 'X';
        wrapper.appendChild(deleteButton);

        wrapper.appendChild(curNode);
        resultElem.appendChild(wrapper);
    }



                    /* PRIVATE HELPER FUNCTIONS BELOW THIS LINE */
    
    /**
     * Fetches data asynchronally from memorized url.
     * Fetch by query or just trending gifs if query is empty.
     * 
     * @param query string to search gifs by; Pass empty string to fetch trending gifs.
     * @returns array of resulting objects
     */
    async _pullData(query) {
        const u = new URLSearchParams();
        u.append('method', 'GET');
        u.append('api_key', this._apiKey);
        u.append('format', 'json');
        u.append('limit', this._limit);
        if(query != '') u.append('q', query);
        const response = await fetch((query == '' ? this._trendingUrl : this._url) + u);
        const result = await response.json();
        return result.data;
    }

    /**
     * Draws result gifs on page
     * 
     * @param data result objects(gifs).
     * @param resultElem element where gifs should be written
     */
    _drawResult(data, resultElem){
        if(data.length == 0){
            resultElem.innerHTML = 'No matching gifs found';
        } else { // Show every matching result
            resultElem.innerHTML = '';
            data.map(entry => {
                const curNode = document.createElement('div');
                curNode.classList.add('item--gif')
                const curImg = document.createElement('img');
                curImg.src = entry.images.fixed_height.url;
                const curRating = document.createElement('div');
                curRating.classList.add('item--gif__rating')
                curRating.innerText = 'Rating:' + entry.rating;
                curNode.appendChild(curImg);
                curNode.appendChild(curRating);
                resultElem.appendChild(curNode);
            });
        }
    }

    /**
     * Save option to local storage.
     * 
     * @param value Value to be saved in localstorage array
     */
    _saveOptionInLS(value){
        const optionList = JSON.parse(localStorage.getItem(config.optionList));
        optionList.push(value);
        localStorage.setItem(config.optionList, JSON.stringify(optionList));
    }

    /**
     * Delete option from local storage.
     * 
     * @param value Value to be deleted from localstorage array
     */
    _deleteOptionFromLS(value){
        let optionList = JSON.parse(localStorage.getItem(config.optionList));
        optionList = optionList.filter(e => e !== value)
        localStorage.setItem(config.optionList, JSON.stringify(optionList));
    }

    /**
     * Adds search options that are saved in local storage in search bar.
     */
    _addOptionsFromLocalStorage(){
        const optionList = JSON.parse(localStorage.getItem(config.optionList));
        optionList.map(option => this.addOption(option));
    }
}

/**
 * Function that is called when an element is clicked.
 * Calls method 'searchByInput()' of the class instance created.
 */
function callSearchRemotely(){
    newSearch.searchByInput(this.value);
}

/**
 * Function that is called when an (delete)element is clicked.
 * Calls method '_deleteOptionFromLS()' of the class instance created.
 * Also deletes search entry from local storage
 */
function callDeleteRemotely(){
    const childArray = Array.from(this.parentNode.childNodes);
    childArray.map(child => {
        if(Array.from(child.classList).includes('search-option')) newSearch._deleteOptionFromLS(child.value);
    });
    this.parentNode.parentNode.removeChild(this.parentNode);
}

if(['', '[]', null].includes(localStorage.getItem(config.optionList))) localStorage.setItem(config.optionList, JSON.stringify(config.defaultOptions));
let newSearch = new Search(config.url, config.trendingUrl, config.apiKey, config.limit);