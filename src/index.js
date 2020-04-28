let quotesUL = document.querySelector("#quote-list")
let quoteForm = document.querySelector('#new-quote-form')

fetch(`http://localhost:3000/quotes?_embed=likes`)
.then(r => r.json())
.then(obj => obj.forEach(populatePage))

function populatePage(quoteInfo){
    let quoteCard = document.createElement('li')
    quoteCard.className = 'quote-card'

    quoteCard.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0">${quoteInfo.quote}</p>
    <footer class="blockquote-footer">${quoteInfo.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quoteInfo.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>`

    quotesUL.append(quoteCard)

    let deleteBtn = quoteCard.querySelector('.btn-danger')
    deleteBtn.addEventListener('click', (evt) => {
        deleteCard(quoteCard, quoteInfo)
    })

    let likeBtn = quoteCard.querySelector('.btn-success')
    likeBtn.addEventListener('click', () => {
        addLike(quoteInfo, likeBtn)
    })
}

function addLike(quoteInfo, likeBtn) {
    fetch(`http://localhost:3000/likes`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: quoteInfo.id
            // can add time created here 
        })
    })
    .then(r => r.json())
    .then(obj => {
        quoteInfo.likes.push(obj)
        likeBtn.querySelector('span').innerText = quoteInfo.likes.length
    })
}

function deleteCard(quoteCard, quoteInfo){
    fetch(`http://localhost:3000/quotes/${quoteInfo.id}`, {
        method: "DELETE"
    })
    .then(r => r.json())
    .then(obj => {
        quoteCard.remove()
    })
}


quoteForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    let quote = evt.target.quote.value
    let author = evt.target.author.value
    addQuote(quote, author)
    evt.target.reset()
})

function addQuote(quote, author){
    fetch(`http://localhost:3000/quotes`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            quote: quote,
            author: author,
            likes: []
        })
    })
    .then(r => r.json())
    .then((obj) => {
        populatePage(obj)
    })
}