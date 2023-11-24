document.getElementsByClassName('hamburgerMenu')[0].addEventListener('click', () => {
    var item = document.getElementById("navItem");
    item.style.display=="none"?item.style.display="block":item.style.display="none"
});

["facebook","github","instagram","linkedin","twitter","youtube"].map(item=>
    document.getElementById("medsosGroup").innerHTML+=`<img src="assets/images/sosialMedia/${item}.png" class="medsos" alt="${item}">`
)

class Book {
    constructor(){
        this.books=[]
    }

    saveBook(){
        localStorage.setItem('books',JSON.stringify(this.books));
    }

    saveDeletedBook(book){
        localStorage.setItem('deletedBook',JSON.stringify(book));
    }

    loadBook(){
        const getBooks = JSON.parse(localStorage.getItem('books'));
        if (getBooks) {this.books = JSON.parse(localStorage.getItem('books'))};
        renderBooksHistory();
    }

    addBook(title, author, year, isComplete){
        const book = {
            id: +new Date(),
            title: title,
            author: author,
            year: year,
            isComplete: isComplete
        }
        this.books.push(book);
        this.saveBook(); //
        renderBooksHistory();
    }

    changeStatus(index){
        this.books[index].isComplete = !this.books[index].isComplete;
        this.saveBook();
        renderBooksHistory();
    }

    editBook(index, newTitle, newAuthor, newYear){
        this.books[index].title = newTitle;
        this.books[index].author = newAuthor;
        this.books[index].year = newYear;
        this.saveBook();
        renderBooksHistory();
    }

    deleteBook(index){
        this.saveDeletedBook(this.books[index]);
        this.books.splice(index,1);
        this.saveBook();
        renderBooksHistory();
    }
}

const book = new Book();
document.addEventListener('DOMContentLoaded', () => {
    if(isStorageExist()) {book.loadBook()}
})

function isStorageExist() {
    return (typeof (Storage) === undefined)?false:true;
}

function renderBooksHistory(listBook = JSON.parse(localStorage.getItem('books'))){
    const ongoingListBook=document.getElementById('ongoingListBook');
    const finishedListBook=document.getElementById('finishedListBook');
    const deletedBookContainer=document.getElementById('deletedListBook');
    ongoingListBook.innerHTML='';
    finishedListBook.innerHTML='';
    deletedBookContainer.innerHTML='';
    var ongoingIndex = 1; var finishedIndex = 1;
    const noResultsFinished = '<img id="notFound" src="assets/images/noResults.gif" alt="no results">';
    const noResultsOngoing = '<img id="notFound" src="assets/images/noResults.gif" alt="no results">';
    if (listBook==null){
        finishedListBook.innerHTML=noResultsFinished; ongoingListBook.innerHTML=noResultsOngoing}
    else {
        if (listBook.filter(item => item.isComplete==false).length==0){ongoingListBook.innerHTML=noResultsOngoing}
        if (listBook.filter(item => item.isComplete==true).length==0){finishedListBook.innerHTML=noResultsFinished}

        const generateBookContainer = (item, index, indexBook) => {
            return (`
                <div class="bookContainer" id=${item.id}>
                <h3 class=${item.isComplete?'finishedIndex':'ongoingIndex'}>${index}</h3>
                <div class="bookData">
                    <h3 id="title">${item.title}</h3>
                    <p id="author">Author : ${item.author}</p>
                    <p id="year">Year   : ${item.year}</p>
                </div>
                <div class="bookButton">
                    <button id=${item.isComplete?'buttonOngoing':'buttonFinished'} onclick="book.changeStatus(${indexBook})">${item.isComplete?'Ongoing':'Finished'}</button>
                    <div class="buttonAction">
                        <button class="buttonEdit" onclick="showEdit(${item.id})">Edit</button>
                        <button class="buttonDelete" onclick="showConfirmation(${item.id})">Delete</button>
                    </div>
                </div>
            </div>`
            )
        }

        listBook.map((item,index) => {
            item.isComplete?(
            finishedListBook.innerHTML+=
            generateBookContainer(item, finishedIndex, index),finishedIndex++)
            :
            (ongoingListBook.innerHTML+=
            generateBookContainer(item, ongoingIndex, index),ongoingIndex++);
        })
    }

    const deletedBook = JSON.parse(localStorage.getItem('deletedBook'));
    deletedBook?
    deletedBookContainer.innerHTML=
    `<div id="deletedBookContainer" class="bookContainer">
        <div class="bookData">
            <h3 id="title">${deletedBook.title} (${deletedBook.isComplete?'Finished':'Ongoing'})</h3>
            <p id="author">Author : ${deletedBook.author}</p>
            <p id="year">Year   : ${deletedBook.year}</p>
        </div>
        <div class="buttonActionDeletedBook">
            <button id="buttonUndo">Undo</button>
            <button id="buttonTrash">Trash</button>
        </div>
    </div>`
    :
    deletedBookContainer.innerHTML=
    `<div id="deletedBookContainer" class="bookContainer">
        <div class="bookData">
            <h3 id="Title">Tidak ada data</h3>
        </div>
    </div>`;

    const buttonUndo = document.getElementById('buttonUndo');
    const buttonTrash = document.getElementById('buttonTrash');

    if(buttonUndo){
        buttonUndo.addEventListener('click', () => {
            const deletedBook = JSON.parse(localStorage.getItem('deletedBook'));
            localStorage.removeItem('deletedBook');
            book.addBook(deletedBook.title, deletedBook.author, deletedBook.year, deletedBook.isComplete);
            renderBooksHistory();
        })
    }
    
    if(buttonTrash){
        buttonTrash.addEventListener('click', () => {
            localStorage.removeItem('deletedBook');
            renderBooksHistory();
        })
    }
}

const form = document.getElementById('addBook');
form.addEventListener('submit', (e) => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isComplete = document.getElementById('isComplete').checked;
    e.preventDefault();
    book.addBook(title, author, year, isComplete);
})

function showEdit(id) {
    renderBooksHistory();
    const bookDataEdit = document.getElementById(id);
    const selectedBook = book.books.filter(book => book.id===id);
    bookDataEdit.classList.add('borderDashed');
    bookDataEdit.getElementsByClassName('bookData')[0].innerHTML=
    `<div class="input">
        <label for="title">Title</label>
        <input type="text" class="title" placeholder="Book title..." >
    </div>
    <div class="input">
        <label for="author">Author</label>
        <input type="text" class="author" placeholder="Book author..." >
    </div>
    <div class="input">
        <label for="year">Year</label>
        <input type="number" class="year" min="1900" max="2023" placeholder="Book year..." >
    </div>`;
    const title = bookDataEdit.getElementsByClassName('title')[0];
    const author = bookDataEdit.getElementsByClassName('author')[0];
    const year = bookDataEdit.getElementsByClassName('year')[0];
    title.defaultValue=selectedBook[0].title;
    author.defaultValue=selectedBook[0].author;
    year.defaultValue=selectedBook[0].year;

    const indexSelectedBook = book.books.findIndex(book => book.id===selectedBook[0].id);
    const buttonEdit = bookDataEdit.getElementsByClassName('buttonEdit')[0];
    buttonEdit.innerText='Save';
    buttonEdit.classList.add('buttonSave');
    const buttonSave = bookDataEdit.getElementsByClassName('buttonSave')[0];
    buttonSave.addEventListener('click', () => {
        buttonSave.classList.replace('buttonSave','buttonEdit');
        const titleValue = title.value; const authorValue = author.value; const yearValue = year.value;
        book.editBook(indexSelectedBook, titleValue, authorValue, yearValue);
    })
}

function showConfirmation(id) {
    renderBooksHistory();
    const bookDataDelete = document.getElementById(id);
    const selectedBook = book.books.filter(book => book.id===id);
    const indexSelectedBook = book.books.findIndex(book => book.id===selectedBook[0].id);
    const buttonDelete = bookDataDelete.getElementsByClassName('buttonDelete')[0];
    buttonDelete.style.display='none';
    bookDataDelete.innerHTML+=
    `<div class="alertContainer">
        <p class="alert">Are you sure want to delete <strong>${selectedBook[0].title}</strong> created by <strong>${selectedBook[0].author}</strong> ?</p>
        <div class="bookButton">
            <button id="buttonNo" onclick="renderBooksHistory()">No</button>
            <button id="buttonYes" onclick="book.deleteBook(${indexSelectedBook})">Yes</button>
        </div>
    </div>`
}

function searchBook(criteria) {
    const listBook = JSON.parse(localStorage.getItem('books'));
    const selectedBook = listBook.filter((item => item.title.toLowerCase().includes(criteria.toLowerCase())));
    renderBooksHistory(selectedBook);
}

document.getElementById('buttonSearch').addEventListener('click', () => {
    const criteria = document.getElementById('searchInput').value;
    searchBook(criteria);
})

document.getElementById('searchInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const criteria = document.getElementById('searchInput').value;
        searchBook(criteria);
    }
})