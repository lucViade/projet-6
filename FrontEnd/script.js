
const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");
const filters = document.querySelector("#filters");
const containerPicture = document.querySelector(".container-picture")
console.log(gallery);
console.log(portfolio);
console.log(containerPicture)

let works = []
let categoryIdFilter = undefined;

function reloadWorks() {
    gallery.replaceChildren();



    //recuperation des travaux      
    works
        .filter((work) => {
            if (categoryIdFilter === undefined) {
                return true
            } else {
                return work.categoryId == categoryIdFilter
            }
        })
        .forEach((work, index) => {
            const img = document.createElement('img')
            img.src = work.imageUrl;
            img.alt = work.title;

            const txt = document.createElement('figcaption')
            txt.textContent = work.title;

            const cards = document.createElement('figure')

            gallery.appendChild(cards)
            cards.appendChild(img);
            cards.appendChild(txt);

        })

}
function reloadWorksModal() {
    containerPicture.replaceChildren();

    works.forEach((work, index) => {

        const icon = document.createElement('img')
        icon.className = "logobin";
        icon.dataset.workId = work.id;
        icon.src = "./assets/icons/bin.svg";

        const img = document.createElement('img')
        img.src = work.imageUrl;
        img.alt = work.title;
        img.className = "picture"



        const txt = document.createElement('p')
        txt.textContent = 'éditer';

        const modalCards = document.createElement('figure')
        modalCards.className = "modalcard"

        containerPicture.appendChild(modalCards)
        modalCards.appendChild(img);
        modalCards.appendChild(txt);
        modalCards.appendChild(icon);

    })
}

//appel de l'API avec Fetch
const promise01 = fetch('http://localhost:5678/api/works');

promise01
    .then((response) => {
        console.log(response);

        const worksData = response.json();

        console.log(worksData);

        worksData.then((w) => {
            works = w
            reloadWorks()
            reloadWorksModal()



        })

    })

const promise02 = fetch('http://localhost:5678/api/categories');

promise02
    .then((response) => {
        console.log(response);

        const categoriesData = response.json();
        console.log(categoriesData);

        categoriesData.then((categories) => {
            console.log(categories[0]);



            const all = document.createElement('li')
            const btnAll = document.createElement('button')
            btnAll.innerText = 'Tous';
            btnAll.id = 0;


            filters.appendChild(all);
            all.appendChild(btnAll);

            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];




                const filter = document.createElement('li')
                const buttonFilter = document.createElement('button')
                buttonFilter.innerText = categories[i].name;
                buttonFilter.id = categories[i].id;
                buttonFilter.dataset.categoryId = categories[i].id

                filters.appendChild(filter);
                filter.appendChild(buttonFilter);
            }


            const btns = document.getElementsByTagName("button")

            for (let i = 0; i < btns.length; i++) {

                btns[i].addEventListener("click", (e) => {
                    categoryIdFilter = e.currentTarget.dataset.categoryId;
                    reloadWorks();


                })

            }
        })
    })

const log = document.querySelector("#log");
const banner = document.querySelector(".banner");
const modifierContainer = document.querySelector(".modifier-container");
const modifierProjetsContainer = document.querySelector(".modifier-projets-container")

function editMode() {
    if (localStorage.login) {
        banner.style = "display: flex"
        log.innerText = "logout"
        modifierContainer.style = "display:flex"
        modifierProjetsContainer.style = "display:flex"

        console.log("Vous êtes connecté !");
    }
    else {
        console.log("Vous n'êtes pas connecté !");
    }
}

editMode()

log.addEventListener("click", () => {
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    log.innerText = "login";
});

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    bindDeleteWorks()
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

}

const closeModal = function (e) {
    if (modal === null) return
   /* e.preventDefault()*/
    modal.style.display = "none"
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const allModals = document.querySelectorAll(".modal")
allModals.forEach((modal) => {
    modal.querySelectorAll('.js-modal-close').forEach((element) => {
        element.addEventListener('click', () => {
            modal.style.display = "none"
        })
    })
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

})



document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})


const openAddPicture = document.querySelector('.add-picture')


openAddPicture.addEventListener('click', openModal)





// fetch suppression travaux
const fetchDelete = (id) => {
    fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        mode: "cors",
    })
        .then((response) => response.json())
};

const deleteMsg = document.querySelector(".delete-msg");
//fonction suppression des images
function bindDeleteWorks(imgValue) {
    const deleteWork = document.querySelectorAll('.logobin');
    deleteWork.forEach((delWork) => {
        delWork.addEventListener("click", (e) => {
            e.preventDefault();
            const workId = e.target.dataset.workId
            console.log("delete workId " + workId)
            fetchDelete(workId)
                .then(() => {
                    return reloadWorksModal()
                })
                .catch((error) => {
                    window.alert("Une erreur est survenue")
                })
        })
    })
}



const addPicModal = document.querySelector(".input-addpic")
const previewImg = document.querySelector(".import-pictures")
const ajoutPhoto = document.querySelector(".block")
const addTitle = document.querySelector(".title")
const addCategorie = document.querySelector(".category")
const submit = document.querySelector(".valider")
const msgError = document.querySelector(".msg-error")
const form = document.querySelector(".formmodal2")
const token = localStorage.token
console.log(form)


function addImage() {
    // Ajout images
    addPicModal.addEventListener("input", (e) => {
        console.log(addPicModal.files[0]);
        inputImg= e.target.files[0];
        const photo = URL.createObjectURL(addPicModal.files[0]);
        // console.log(photo)
        previewImg.src = photo;
        previewImg.style.setProperty("visibility", "visible");
        ajoutPhoto.style.display = "none"

    });

    //Titre
    addTitle.addEventListener("input", (e) => {
        inputTitle = e.target.value;
        console.log(inputTitle)
    });
    //Catégories
    addCategorie.addEventListener("input", (e) => {
        inputCategory = e.target.selectedIndex;
        console.log(inputCategory)
    });

    // Si tout les elements sont remplies alors changements couleurs boutons !== (strictement different)
    form.addEventListener("change", () => {
        if (imgPreview !== "" && inputTitle !== "" && inputCategory !== "") {
            submit.style.background = "#1D6154";
            submit.style.cursor = "pointer";
        }
        else {
            submit.style.backgroundColor = ''; // Réinitialise la couleur par défaut du bouton
        }
    });


    //Submit
    submit.addEventListener("click", (e) => {
        e.preventDefault();
        if (imgPreview && inputTitle && inputCategory) {
            const formData = new FormData();
            console.log(imgPreview, inputTitle, inputCategory);
            formData.append("image", imgPreview);
            formData.append("title", inputTitle);
            formData.append("category", inputCategory);
            console.log(formData);

            fetchDataSubmit()
            async function fetchDataSubmit() {
                try {
                    // Fetch ajout des travaux
                    const response = await fetch("http://localhost:5678/api/works", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    });
                    const dataresponse = await response.json()
                    console.log(dataresponse);
                    msgError.style.color = "#1D6154";
                    submit.style.background = "#1D6154"

                    //Clear les galeries
                    gallery.innerHTML = "";
                    fetchDataWorks();
                    previewImg.style.setProperty("visibility", "hidden");
                    imgContainer.style.setProperty("display", "flex");
                    setTimeout(() => {
                        msgError.innerText = "";
                    }, 4000);
                }
                catch (error) {
                    console.log("Il y a eu une erreur sur le Fetch: " + error)
                }
            }

        } else {
            msgError.innerText = "Veuillez remplir tous les champs.";
            msgError.style.color = "red";
            setTimeout(() => {
                msgError.innerText = "";
            }, 4000);
            console.log("Tous les champs ne sont pas remplis !");
        }
    });
}



addImage()




const arrowBack = document.querySelector('.arrowback')
arrowBack.addEventListener('click', function () {
    if (isPreviewVisible()) { 
        closeImage()
    }
    else {
        closeModal()
    }
})
  

function isPreviewVisible() {
    return ajoutPhoto.style.display == "none"
}
function closeImage() {
    previewImg.style.display = "none"
    ajoutPhoto.style.display = "flex"
}
function openImage() {
    previewImg.style.display = "flex"
    ajoutPhoto.style.display = "none"
}


