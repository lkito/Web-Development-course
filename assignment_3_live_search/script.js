class Search {
    
    /**
     * Costructor. Memorizes data source
     * @param url string of url of the data source
     */
    constructor(url){
        this._url = url;
    }

    
    /**
     * Fetches data asynchronally from memorized url
     * @returns array of commit objects
     */
    async _pullData() {
        let response = await fetch(this._url);
        let commits = await response.json();
        return commits;
    }

    /**
     * Fetch data and filter result by text entered in input field.
     * Show full messages as hyperlinks to the commit page of each result.
     * Called when input is changed.
     */
    async searchByInput(){
        let resultElem = document.getElementById('search-results');
        let msg = document.getElementById('search-field').value;
        if(msg == ""){ // Return no results if query is empty
            resultElem.innerHTML = "";
            return;
        }
        let data = await this._pullData();
        // Filter by input text
        data = data.filter(entry => entry.commit.message.includes(msg));
        if(data.length == 0){
            resultElem.innerHTML = 'No matching message found';
        } else { // Show every matching result as a hyperlink inside results div.
            resultElem.innerHTML = '';
            data.map(entry => {
                let curNode = document.createElement('div');
                let link = document.createElement('a');
                let linkText = document.createTextNode(entry.commit.message);
                link.href = entry.html_url;
                link.target = '_blank';
                link.appendChild(linkText);
                curNode.appendChild(link);
                resultElem.appendChild(curNode);
                resultElem.appendChild(document.createElement('br'));
            });
        }
    }
}

let newSearch = new Search('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits');
