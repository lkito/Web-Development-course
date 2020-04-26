import config from "./config.js";
import StorageManager from "./storageManager.js";

class Search {
    
    /**
     * Initialize page elements.
     */
    static initialize(){
        const submitElem = document.getElementById('submit-button');
        submitElem.addEventListener('click', function(){
            Search.addOption();
        });
        const randElem = document.getElementById('random-button');
        randElem.addEventListener('click', function(){
            Search.searchTrending();
        });
        Search._addOptionsFromLocalStorage(); // Load stored options
    }

    /**
     * Fetch data by text entered in input field.
     * Called when input button is pressed.
     * 
     * @param query Text to search by from input.
     */
    static async searchByInput(query){
        const resultElem = document.getElementById('search-results');
        if(query == ''){ // Return no results if query is empty
            resultElem.innerHTML = '';
            return;
        }
        const data = await Search._pullData(query);
        Search._drawResult(data, resultElem);
    }

    /**
     * Fetch trending gifs.
     * Called when trending button is pressed.
     */
    static async searchTrending(){
        const resultElem = document.getElementById('search-results');
        const data = await Search._pullData('');
        Search._drawResult(data, resultElem);
    }

    /**
     * Adds passed option to options. if Empty, gets value from search bar.
     * Called when Submit button is pressed or during page load, when adding options from localstorage.
     * 
     * @param query name of new option.
     */
    static addOption(query=''){
        if(query == ''){ // If Empty, gets value from search bar.
            query = document.getElementById('search-field').value;
            if(query == '') return;
            Search.searchByInput(query); // Search for result even if option is already saved
            // Check if we already have this option
            if(JSON.parse(localStorage.getItem(config.optionList)).includes(query)) return;
            StorageManager.saveOptionInLS(query);
        }
        Search._drawOption(query);
    }



                    /* PRIVATE HELPER FUNCTIONS BELOW THIS LINE */
    
    /**
     * Fetches data asynchronally from memorized url.
     * Fetch by query or just trending gifs if query is empty.
     * 
     * @param query string to search gifs by; Pass empty string to fetch trending gifs.
     * @returns array of resulting objects
     */
    static async _pullData(query) {
        const u = new URLSearchParams();
        u.append('method', 'GET');
        u.append('api_key', config.apiKey);
        u.append('format', 'json');
        u.append('limit', config.limit);
        if(query != '') u.append('q', query);
        const response = await fetch((query == '' ? config.trendingUrl : config.url) + u);
        const result = await response.json();
        return result.data;
    }

    /**
     * Creates and returns delete button element
     * 
     * @param query name of the added option
     */
    static _getDeleteElem(query){
        const deleteButton = document.createElement('input'); // Option delete button
        deleteButton.type = 'button';
        deleteButton.addEventListener('click', function(){
            const childArray = Array.from(this.parentNode.childNodes);
            childArray.map(child => {
                if(Array.from(child.classList).includes('search-option')) StorageManager.deleteOptionFromLS(child.value);
            });
            this.parentNode.parentNode.removeChild(this.parentNode);
        });
        deleteButton.className = 'btn item--search__delete';
        deleteButton.value = 'X';
        return deleteButton;
    }

    /**
     * Creates and returns option element
     * 
     * @param query name of the added option
     */
    static _getOptionElem(query){
        const curNode = document.createElement('input'); // Option button
        curNode.type = 'button';
        curNode.addEventListener('click', function(){
            Search.searchByInput(this.value);
        });
        curNode.className = 'btn item--search search-option';
        curNode.value = query;
        return curNode;
    }

    /**
     * Draws result option on page.
     * 
     * @param query name of the added option
     */
    static _drawOption(query){
        const resultElem = document.getElementById('search-options'); // Parent element

        const wrapper = document.createElement('div'); // Wrapper element
        wrapper.className = 'item--search-wrapper';
        const curNode = Search._getOptionElem(query)
        const deleteButton = Search._getDeleteElem(query);

        wrapper.appendChild(deleteButton);
        wrapper.appendChild(curNode);
        resultElem.appendChild(wrapper);
    }

    /**
     * Draws result gifs on page
     * 
     * @param data result objects(gifs).
     * @param resultElem element where gifs should be written
     */
    static _drawResult(data, resultElem){
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
     * Adds search options that are saved in local storage in search bar.
     */
    static _addOptionsFromLocalStorage(){
        const optionList = JSON.parse(localStorage.getItem(config.optionList));
        optionList.map(option => Search.addOption(option));
    }
}

StorageManager.updateOptionsInLS(); // Check options in localstorage
Search.initialize(); // Initialize important details on page.