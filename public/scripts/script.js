"use strict";
var currentAnimal = "none";
var lastSearched = "none";
var currentArray = [];
const sect = document.getElementById("sect");

get("Dogs");
async function get(str) {
    console.log(str);
    if (lastSearched === str) //stop searching if the last search was the same
        return;
    const array = await fetch(`view/${str}`).then(async (response) => {
        if (response !== null && response.ok)
            return await response.json();
        throw new Error(response.statusText);
    }).catch(err => {
        console.error(err);
        return null;
    });
    if (array === null)
        return;
    console.log(array);
    const view = array.map(element => {
        const dom = document.createElement("figure");
        dom.className = 'body-div';
        const imag = document.createElement("img");
        //imag.src = element.image;
        imag.src = 'assets/Birds-placeholder.png';
        imag.alt = `a ${currentAnimal}`;
        imag.className = 'body-img';
        imag.addEventListener('click', () => makeModal(element.id));
        const caption = document.createElement("figcaption");
        caption.innerHTML = ` Name:  ${element.name}<br>
                            Origin:  ${element.origin || element.place_found}  `;
        dom.appendChild(imag);
        dom.appendChild(caption);
        return dom;
    }); // Origin me OR, se origjina esht bosh per zogjt psh
    while (sect.firstChild !== null)
        sect.removeChild(sect.firstChild);
    currentArray = array;
    for (const element of view)
        sect.appendChild(element);
    if (["Dogs", "Cats", "Birds"].includes(str))
        currentAnimal = str; //to keep track of the current animal
    lastSearched = str;
}
function makeModal(id) {
    const object = currentArray.find(element => element.id === id);
    const table = document.createElement('table');
    table.id = 'moTable';
    for (const [key, value] of Object.entries(object)) {
        const row = document.createElement('tr');
        for (let inner of [key, value]) {
            const dom = document.createElement('td');
            const str = String(inner);
            dom.textContent = str;
            row.appendChild(dom);
        }
        table.appendChild(row);
    }
    modalWindow(table);
}
function modalWindow(dom) {
    let moDiv = document.getElementById("mod"); //marrim div me kte id dhe i japim klasen e cila ne css i jep vetite e duhura
    moDiv.addEventListener("click", unMakeModal);
    moDiv.className = "modal";
    moDiv.appendChild(dom);
}
function unMakeModal() {
    let moDiv = document.getElementById("mod");
    moDiv.className = '';
    while (moDiv.firstChild !== null)
        moDiv.removeChild(moDiv.firstChild);
}
for (const animal of ["Dogs", "Cats", "Birds"]) {
    document.getElementById(animal).addEventListener("click", () => get(animal));
}
const searchBar = document.getElementById("s-bar");
searchBar.addEventListener("keypress", (event) => {
    if (event.key !== "Enter")
        return;
    get(`${currentAnimal}?search=${searchBar.value}`);
});
document.getElementById("search-button").addEventListener("click", () => get(`${currentAnimal}?search=${searchBar.value}`));
document.getElementById("filter").addEventListener("click", () => {
    const nr = Number.parseInt(searchBar.value);
    if (nr === 0)
        return;
    get(`${currentAnimal}?limit=${nr}`);
});
document.getElementById("sort").addEventListener("click", () => get(`${currentAnimal}?sort=name&order=inc`));
document.getElementById("about").addEventListener("click", () => contact("About Us", `Welcome to <b>Example</b> 
        where we share information related to Animal Gallery. 
        We're dedicated to providing you the very best information and knowledge of the above mentioned topics.`, `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`));
document.getElementById("contact").addEventListener("click", () => contact("Contacts", `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`, `Email: mirialliu@gmail.com <br>
        Phone: +355 6x xx xx xxx`));
function contact(head, p1Str, p2Str) {
    const dom = document.createElement('div');
    const header = document.createElement('h2');
    header.textContent = head;
    const para = document.createElement('p');
    para.innerHTML = p1Str;
    const para2 = document.createElement('p');
    para2.innerHTML = p2Str;
    for (const element of [header, para, para2])
        dom.appendChild(element);
    modalWindow(dom);
}
;
window.addEventListener("wheel", event => {
    sect.style.scrollBehavior = "auto";
    sect.scrollLeft += event.deltaY;
    sect.style.scrollBehavior = "smooth";
});
window.addEventListener("keydown", event => {
    const fig = document.querySelector('figure');
    if (fig === null)
        return;
    if (event.key === "ArrowLeft")
        sect.scrollLeft -= fig.clientWidth;
    else if (event.key === "ArrowRight")
        sect.scrollLeft += fig.clientWidth;
});
