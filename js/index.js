document.addEventListener("DOMContentLoaded", () => {
  const listPanel = document.querySelector('#list-panel');
  const showPanel = document.querySelector('#show-panel');
  
  const renderBooks = (json) => {
    json.forEach(book => {
      const li = document.createElement('li');
      li.innerText = book.title;
      listPanel.appendChild(li);

      li.addEventListener('click', () => {
        showPanel.querySelectorAll('*').forEach(item => item.remove());

        let liked = false;
        const img = document.createElement('img');
        const title = document.createElement('h3');
        const subtitle = document.createElement('h3');
        const author = document.createElement('h3');
        const description = document.createElement('p');
        const ul = document.createElement('ul');
        const buttonLike = document.createElement('button');
        const buttonUnlike = document.createElement('button');

        img.src = book.img_url;
        title.innerText = book.title;
        subtitle.innerText = book.subtitle;
        author.innerText = book.author;
        description.innerText = book.description;
      
        showPanel.appendChild(img);
        showPanel.appendChild(title);
        showPanel.appendChild(subtitle);
        showPanel.appendChild(author);
        showPanel.appendChild(description);
        showPanel.appendChild(ul);

        book.users.forEach(user => {
          const li = document.createElement('li');
          li.innerText = user.username;
          ul.appendChild(li);

          if (user.username === 'Dewey') {
            liked = true;
          } 
        });

        if(liked) {
          buttonUnlike.innerText = 'unlike';
          showPanel.appendChild(buttonUnlike);
        } else if (book.users.length == 0) {
          buttonLike.innerText = 'like';
          showPanel.appendChild(buttonLike);
        }
        
        buttonLike.addEventListener('click', () => {
          fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: 
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              users: [ ...book.users, { username: 'Dewey'} ]
            })
          }).then(res => res.json())
          .then(json => {
            const li = document.createElement('li');
            li.innerText = json.users[json.users.length - 1].username;
            ul.appendChild(li);
            showPanel.removeChild(buttonLike);
            buttonUnlike.innerText = 'unlike';
            showPanel.appendChild(buttonUnlike);
          });
        });

        buttonUnlike.addEventListener('click', () => {
          fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: 
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              users: [ ...book.users ]
            })
          }).then(res => res.json())
          .then(json => {
            showPanel.removeChild(buttonUnlike);
            buttonLike.innerText = 'like';
            showPanel.appendChild(buttonLike);
          });
        });
      });
    });
  }

  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(json => renderBooks(json));
});
