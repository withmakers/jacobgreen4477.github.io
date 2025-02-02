(function() {
    function displaySearchResults(results, store) {
        var searchResults = document.getElementById('search-results');

        if (results.length) { // Are there any results?
            var appendString = '';

            for (var i = 0; i < results.length; i++) {  // Iterate over the results
                var item = store[results[i].ref];
                appendString += '<li class="post-list-item"><a href="' + item.url + '" style="line-height:normal;"><h2>' + item.title + '</h2></a>';
                appendString += '<p class="post-list-description" style="overflow:hidden ;position:relative; line-height:1.3em; max-height:3.6em; text-align:justify; margin-right:-1em; padding-right:1em;">' + item.content.substring(0, 150) + '...</p></li>';
            }

            searchResults.innerHTML = appendString;
        } else {
            searchResults.innerHTML = '<li class="post-list-item">검색 결과가 없습니다.</li>';
        }
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
            }
        }
    }

    function trimmerEnKo(token) {
        return token
            .replace(/^[^\w가-힣]+/, '')
            .replace(/[^\w가-힣]+$/, '');
    };

    var searchTerm = getQueryVariable('query');

    if (searchTerm) {
        document.getElementById('search-box').setAttribute("value", searchTerm);

        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function () {
            this.pipeline.reset();
            this.pipeline.add(
                trimmerEnKo,
                lunr.stopWordFilter,
                lunr.stemmer
            );
            this.field('id');
            this.field('title', { boost: 10 });
            this.field('author');
            this.field('category');
            this.field('content');
        });

        for (var key in window.store) { // Add the data to lunr
            idx.add({
                'id': key,
                'title': window.store[key].title,
                'author': window.store[key].author,
                'category': window.store[key].category,
                'content': window.store[key].content
            });

            var results = idx.search(searchTerm); // Get lunr to perform a search
            displaySearchResults(results, window.store); // We'll write this in the next section
        }
    }
})();