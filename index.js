const publicKey = "7154218a9ed5368f2076f3c884a305fe";
const privateKey = "9c8be8f3e7dafa036accc5d34918e912b06be5ac";
const ts = "1";

const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

const baseURL = "https://gateway.marvel.com/v1/public/characters";
const url = `${baseURL}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

document
  .getElementById("guardarDades")
  .addEventListener("click", async function () {
    try {
      const tsNow = Date.now();
      const hashNow = CryptoJS.MD5(tsNow + privateKey + publicKey).toString();
      const URLNow = `${baseURL}?ts=${tsNow}&apikey=${publicKey}&hash=${hashNow}`;

      const response = await fetch(URLNow);
      const characters = await response.json();

      await saveCharactersInJsonFile(characters.data.results);
    } catch (error) {
      console.error("Error al obtenir personatges:", error);
    }
  });

// Funció per obtenir els personatges de la API de Marvel
async function getCharacters() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const characters = data.data.results;

    return characters;
  } catch (error) {
    console.error("Error en obtenir els personatges:", error);
    throw error;
  }
}

// Funció para guardar els personatges en un fitxer JSON
async function saveCharactersInJsonFile(characters) {
  try {
    // Realitza una petició al servidor per obtenir la llista de personatges
    const response = await fetch("http://localhost:3001/characters");
    const existingCharacters = await response.json();

    // Verifica si ja hi ha personatges al servidor
    if (existingCharacters.length > 0) {
      // Mostrar un missatge indicant que ja hi ha personatges guardats al servidor
      document.getElementById("missatge").innerHTML =
        "Ja hi ha personatges guardats al servidor.";
    } else {
      // Si no hi ha personatges, envia els personatges obtinguts de la API al servidor
      const saveResponse = await fetch("http://localhost:3001/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(characters),
      });

      if (saveResponse.ok) {
        // Mostrar un missatge si els personatges s'han guardat correctament
        document.getElementById("missatge").innerHTML =
          "Personatges desats correctament.";
        console.log("Personajes enviados al servidor JSON correctamente");
      } else {
        // Mostrar un missatge si hi ha hagut un error al guardar els personatges
        document.getElementById("missatge").innerHTML =
          "Error en desar els personatges.";
        console.error("Error en enviar els personatges al servidor JSON");
      }
    }
  } catch (error) {
    // Mostra un missatge si hi ha hagut un error al realitzar la operació
    document.getElementById("missatge").innerHTML = "Error en fer l'operació.";
    console.error("Error en fer l'operació:", error);
  }
}
document
  .getElementById("llistarPersonatges")
  .addEventListener("click", async function () {
    try {
      const localApiUrl = "http://localhost:3001/characters";
      const response = await fetch(localApiUrl);
      const data = await response.json();

      // Accedir al primer element de la resposta, que deberia ser un arreglo de personajes
      const charactersArray = data[0]; //Accedir al primer element de la resposta, que hauria de ser un array de personatges

      if (!Array.isArray(charactersArray)) {
        console.error("La respuesta no es un arreglo:", charactersArray);
        return;
      }

      charactersArray.forEach(function (character) {
        createHero(character);
      });
    } catch (error) {
      console.error("Error en obtenir o guardar els personatges:", error);
    }
  });

function createHero(heroObject) {
  // Verifica si el objecte de personatge es vàlid
  if (!heroObject || !heroObject.name || typeof heroObject.id === "undefined") {
    console.error("HeroObject no válido o sin definir:", heroObject);
    return;
  }

  
  const name = heroObject.name,
    thumbnail = `${heroObject.thumbnail.path}/portrait_uncanny.${heroObject.thumbnail.extension}`,
    templateHero = `
            <div class="col-lg-3 col-md-4 col-sm-6 col-12 heroCard">
                <h3 class="center-text">${name}</h3>
                <img class="img-fluid" src="${thumbnail}" alt="${name}">
            </div>
        `;

  document.getElementById("hero").insertAdjacentHTML("beforeEnd", templateHero);

  // Afegir el personatge al desplegable
  const option = document.createElement("option");
  option.value = heroObject.id; 
  option.text = name; 
  document.getElementById("selectPersonaje").appendChild(option); 
  
}

document.getElementById("eliminarPersonatge").addEventListener("click", async function () {
  try {
    const selectedId = document.getElementById("selectPersonaje").value; // Directament el ID seleccionat
    console.log("Selected ID:", selectedId); // Verifica el ID seleccionat

    if (!selectedId) {
      document.getElementById("missatge").innerHTML = "Seleccioneu un personatge abans d'eliminar.";
      return;
    }

    
    const deleteResponse = await fetch(`http://localhost:3001/characters/${selectedId}`, {
      method: "DELETE"
    });

    if (deleteResponse.ok) {
      // Si el servidor respon amb èxit
      document.getElementById("missatge").innerHTML = `Personatge eliminat correctament.`;

      // Eliminar el element del <select>
      const optionToRemove = document.querySelector(`#selectPersonaje option[value='${selectedId}']`);
      if (optionToRemove) {
        optionToRemove.remove();
      }
    } else {
      // Si hi ha hagut un error al eliminar el personatge
      throw new Error('Error al eliminar el personaje en el servidor');
    }
  } catch (error) {
    // Gestiona l'error si hi ha hagut un problema al fer l'operació
    document.getElementById("missatge").innerHTML = "Error en fer l'operació.";
    console.error("Error en fer l'operació:", error);
  }
});

document.getElementById("aplicarFiltre").addEventListener("click", function () {
  getCharacters()
    .then((response) => {

      const characters = response[0]; // Accedim al primer element de la resposta, que hauria de ser un array de personatges


      const filtroNom = document.getElementById("nomFiltre").value.toLowerCase();
      const personatgesFiltrats = characters.filter(character => 
        character.name && character.name.toLowerCase().includes(filtroNom)
      );

      mostrarPersonatgesFiltrats(personatgesFiltrats);
    })
    .catch((error) => console.error("Error fetching characters:", error));
});


function mostrarPersonatgesFiltrats(personatges) {
  const container = document.getElementById("heroFiltratPerNom");
  container.innerHTML = ""; // Netegem el contingut actual del contenidor

  personatges.forEach((personatge) => {
    const div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-sm-6 col-12 heroCard";
    div.innerHTML = `
          <h3 class="center-text">${personatge.name}</h3>
          <img class="img-fluid" src="${personatge.thumbnail.path}.${personatge.thumbnail.extension}" alt="${personatge.name}">
      `;
    container.appendChild(div);
  });
}


async function getCharacters() {
  const response = await fetch("http://localhost:3001/characters");
  const data = await response.json();
  console.log(data); 
  return data;
}
