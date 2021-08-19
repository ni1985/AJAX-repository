(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
    
        //prepare and send the request to unsplashed
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.onerror = function(err) {
            requestError(err, 'image');
        };
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.setRequestHeader('Authorization','Client-ID e_z-CNHAQXMM2KREp_07H7E--OX3EzLLRDzeXsYcSNc');
        unsplashRequest.send();

        //prepare and send the request to NYT
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function(err) {
            requestError(err, 'image');
        };
        articleRequest.open('GET',`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=Ece4bjJ0xarAckTT7ozz2TuUWHBL8eJ1`);
        articleRequest.send();
    });

    function addImage() {
        let htmlContent = "";
        const data = JSON.parse(this.responseText);
        
        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
                <img src = "${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class ="error-no-image">No images available</div>';
        }
        
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
    
    //const searchedForText = 'hippos';
    
    function addArticles() {
        let htmlContent = "";
        const data = JSON.parse(this.responseText);

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>`
            ).join('')+'</ul>';
        } else {
            htmlContent = '<div class ="error-no-articles">No articles available</div>';
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }  
})();
