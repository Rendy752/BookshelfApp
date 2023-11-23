var item = document.getElementById("navItem");
document.getElementsByClassName('hamburgerMenu')[0].addEventListener('click', () =>
    item.style.display=="none"?item.style.display="block":item.style.display="none"
);

["facebook","github","instagram","linkedin","twitter","youtube"].map(item=>
    document.getElementById("medsosGroup").innerHTML+=`<img src="assets/images/sosialMedia/${item}.png" class="medsos" alt="${item}">`
);

class Book {
    constructor(){
        this.books=[];
    }

    saveBook(){
        localStorage.setItem('books',JSON.stringify(this.books));
    }

    loadBook(){
        this.books = JSON.parse(localStorage.getItem('books'));
        renderBooksHistory();
    }

    addBook(title, author, year, isCompleted){
        const book = {
            id: +new Date(),
            title: title,
            author: author,
            year: year,
            isCompleted: isCompleted
        }
        this.books.push(book);
        this.saveBook(); //
        renderBooksHistory();
    }

    changeStatus(index){
        this.books[index].isCompleted = !this.books[index].isCompleted;
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
        this.books.splice(index,1);
        this.saveBook();
        renderBooksHistory();
    }
}

const book = new Book();
document.addEventListener('DOMContentLoaded', () => {
    if(isStorageExist()) {book.loadBook()}
});

function isStorageExist() {
    return typeof (Storage) === undefined?(alert('Browser kamu tidak mendukung local storage'),false):true;
}

function isStorageExist() {
    return (typeof (Storage) === undefined)?false:true;
}

function renderBooksHistory(listBook = JSON.parse(localStorage.getItem('books'))){
    const ongoingListBook=document.getElementById('ongoingListBook');
    const finishedListBook=document.getElementById('finishedListBook');
    ongoingListBook.innerHTML='';
    finishedListBook.innerHTML='';
    var ongoingIndex = 1; var finishedIndex = 1;
    // const listBook = JSON.parse(localStorage.getItem('books'));
    if (listBook.filter(item => item.isCompleted==false)==0){
        ongoingListBook.innerHTML+='<img id="notFound" src="assets/images/noResults.gif" alt="no results">'
    }
    if (listBook.filter(item => item.isCompleted==true)==0){
        finishedListBook.innerHTML+='<img id="notFound" src="assets/images/noResults.gif" alt="no results">'
    }
    listBook.map((item,index) => {
        item.isCompleted?(
        finishedListBook.innerHTML+=
        `<div class="bookContainer" id="${item.id}">
            <h3 class="finishedIndex">${ongoingIndex}</h3>
            <div class="bookData">
                <h3 id="title">${item.title}</h3>
                <p id="author">Author : ${item.author}</p>
                <p id="year">Year   : ${item.year}</p>
            </div>
            <div class="bookButton">
                <button id="buttonOngoing" onclick="book.changeStatus(${index})">Ongoing</button>
                <div class="buttonAction">
                    <button class="buttonEdit" onclick="showEdit(${item.id})">Edit</button>
                    <button class="buttonDelete" onclick="showConfirmation(${item.id})">Delete</button>
                </div>
            </div>
        </div>`,ongoingIndex++)
        :
        (ongoingListBook.innerHTML+=
        `<div class="bookContainer" id="${item.id}">
            <h3 class="ongoingIndex">${finishedIndex}</h3>
            <div class="bookData">
                <h3 id="title">${item.title}</h3>
                <p id="author">Author : ${item.author}</p>
                <p id="year">Year   : ${item.year}</p>
            </div>
            <div class="bookButton">
                <button id="buttonFinished" onclick="book.changeStatus(${index})">Finished</button>
                <div class="buttonAction">
                    <button class="buttonEdit" onclick="showEdit(${item.id})">Edit</button>
                    <button class="buttonDelete" onclick="showConfirmation(${item.id})">Delete</button>
                </div>
            </div>
        </div>`,finishedIndex++);
    })
}

const form = document.getElementById('addBook');
form.addEventListener('submit', (e) => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isComplete = document.getElementById('isComplete').checked;
    e.preventDefault();
    book.addBook(title, author, year, isComplete);
});

function showEdit(id) {
    renderBooksHistory();
    const bookDataEdit = document.getElementById(id);
    const selectedBook = book.books.filter(book => book.id===id);
    bookDataEdit.classList.add('borderDashed');
    bookDataEdit.getElementsByClassName('bookData')[0].innerHTML=`
    <div class="input">
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
    // console.log(indexSelectedBook, title.value, author.value, year.value);

    buttonSave.addEventListener('click', () => {
        buttonSave.classList.replace('buttonSave','buttonEdit');
        const titleValue = title.value; const authorValue = author.value; const yearValue = year.value;
        // console.log(indexSelectedBook, titleValue, authorValue, yearValue);
        book.editBook(indexSelectedBook, titleValue, authorValue, yearValue);
    });
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
    // console.log(criteria);
    // console.log(localStorage.getItem('books'));
    const listBook = JSON.parse(localStorage.getItem('books'));
    console.log(listBook.filter((item => item.title.includes(criteria))));
    const selectedBook = listBook.filter((item => item.title.toLowerCase().includes(criteria.toLowerCase())));
    console.log(selectedBook);
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
});