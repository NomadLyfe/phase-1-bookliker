document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(data => displayBooks(data));
    function displayBooks(books) {
        for (const book of books) {
            const ul = document.querySelector('#list');
            const li = document.createElement('li');
            li.textContent = book.title;
            li.id = book.id;
            ul.appendChild(li);
            li.addEventListener('click', showBookDetails);
        }
    }
    let bookData = [];
    function showBookDetails(e) {
        fetch('http://localhost:3000/books')
            .then(resp => resp.json())
            .then(data => {
                bookData = [...data];
                const index = e.target.id-1;
                const infoPanel = document.querySelector('#show-panel');
                infoPanel.innerHTML = '';
                const img = document.createElement('img');
                const h31 = document.createElement('h3');
                const h32 = document.createElement('h3');
                const h33 = document.createElement('h3');
                const p = document.createElement('p');
                const ul = document.createElement('ul');
                const btn = document.createElement('button');
                img.src = data[index].img_url;
                h31.textContent = data[index].title;
                h32.textContent = data[index].subtitle;
                h33.textContent = data[index].author;
                p.textContent = data[index].description;
                for (const user of data[index].users) {
                    const li = document.createElement('li');
                    li.textContent = user.username;
                    ul.appendChild(li);
                }
                btn.id = data[index].id;
                infoPanel.appendChild(img);
                infoPanel.appendChild(h31);
                infoPanel.appendChild(h32);
                infoPanel.appendChild(h33);
                infoPanel.appendChild(p);
                infoPanel.appendChild(ul);
                infoPanel.appendChild(btn);
                for (const user of data[index].users) {
                    if (user.id === 1) {
                        btn.textContent = 'UNLIKE';
                    } else {
                        btn.textContent = 'LIKE';
                    }
                }
                btn.addEventListener('click', likeBook);
            })    
    }
    function likeBook(e) {
        if (e.target.textContent === 'LIKE') {
            fetch(`http://localhost:3000/books/${e.target.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "users": [
                        ...bookData[e.target.id-1].users,
                        {"id": 1, "username": "pouros"}
                    ]
                })
            })
                .then(resp => resp.json())
                .then(() => showBookDetails(e));
        } else {
            const index = bookData[e.target.id-1].users.findIndex(obj => obj.id === 1);
            const newUsers = [...bookData[e.target.id-1].users].splice(0,index);
            fetch(`http://localhost:3000/books/${e.target.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "users": newUsers
                })
            })
                .then(resp => resp.json())
                .then(() => showBookDetails(e));
        }
        
    }

});
