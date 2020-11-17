const result = document.querySelector("#resultado");
const form = document.querySelector("#formulario");
const paginationDiv = document.querySelector("#paginacion");

const APIKey = "19063155-71029deb31a7bb03ce97186ef";
const paginationLength = 40;
let searchTerm;
let totalPages;
let iterator;
let currentPage;

window.onload = () => {
  form.addEventListener("submit", checkForm);
};

function checkForm(e) {
  e.preventDefault();
  searchTerm = document.querySelector("#termino").value;
  if (searchTerm === "") {
    showAlert("El termino de búsqueda es requerido.");
    return;
  }

  searchImages();
}

async function searchImages() {
  const url = `https://pixabay.com/api/?key=${APIKey}&q=${searchTerm}&image_type=photo&per_page=${paginationLength}&page=${currentPage}`;
  try {
    const res = await fetch(url);
    const result = await res.json();
    totalPages = definePages(result.totalHits);
    showImages(result.hits);
  } catch (error) {
    console.log(error);
  }
}

function* paginationGenerator(totalPages) {
  for (let i = 1; i <= totalPages; i++) {
    yield i;
  }
}

function showImages(results) {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  results.forEach((imgData) => {
    const { previewURL, likes, views, largeImageURL } = imgData;
    result.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">

                <div class="p-4">
                    <p class="font-bold"> ${likes} <span class="font-light">Me gusta.</span> </p>
                    <p class="font-bold"> ${views} <span class="font-light">Veces vista..</span> </p>

                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
                </div>
            </div>
        </div>
      `;
  });

  while (paginationDiv.firstChild) {
    paginationDiv.removeChild(paginationDiv.firstChild);
  }
  printPaginator();
}

function printPaginator() {
  iterator = paginationGenerator(totalPages);
  while (true) {
    const { value, done } = iterator.next();
    if (done) return;

    const buttom = document.createElement("a");
    buttom.href = "#";
    buttom.dataset.page = value;
    buttom.textContent = value;
    buttom.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-3",
      "rounded"
    );
    buttom.onclick = () => {
      currentPage = value;
      searchImages();
    };
    paginationDiv.appendChild(buttom);
  }
}

function showAlert(msg) {
  const isExistAlert = document.querySelector(".bg-red-100");
  if (!isExistAlert) {
    const alert = document.createElement("p");
    alert.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );
    alert.innerHTML = `
     <strong class="font-bold">Error!</strong>
     <span class="block sm:inline">${msg}</span>
    `;

    form.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function definePages(total) {
  return parseInt(Math.ceil(total / paginationLength));
}
