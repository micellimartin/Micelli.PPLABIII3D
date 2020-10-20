import {Anuncio_Mascota} from "./entidades.js";

let listaEntidades;
let frmEntidad;
let proximoId;
let tabla;

window.addEventListener("load", incializarManejadores);

btnAlta.addEventListener('click', altaAnuncio);
btnEliminar.addEventListener('click', bajaAnuncio);
btnModificar.addEventListener('click', modificarAnuncio);
btnCancelar.addEventListener('click', cancelar);

function incializarManejadores() 
{
    listaEntidades = obtenerEntidades();
    proximoId = obtenerProximoId();

    console.log("Proximo ID: ", proximoId);

    tabla = document.getElementById("divTabla");
    actualizarLista();

    frmEntidad = document.forms[0];
    frmEntidad.addEventListener("submit", e => {
        e.preventDefault();
    })
}

function altaAnuncio() 
{
    const nuevoAnuncio = obtenerAnuncio();

    if(nuevoAnuncio) 
    {
        listaEntidades.push(nuevoAnuncio);
        proximoId++;
        guardarDatos();
        actualizarLista();
        document.forms[0].reset();
    }
}

function obtenerAnuncio() 
{
    let nuevoAnuncio = null;

    if(!(document.querySelector("#txtTitulo").value == "") && !(document.querySelector("#txtDescripcion").value == "") && !(document.querySelector("#txtPrecio").value == "")
    && !(document.getElementById("txtRaza").value == "")  && !(document.getElementById("txtFechaNacimiento").value == "") && !(document.getElementById("cmb").value == ""))
    {
        nuevoAnuncio = new Anuncio_Mascota(proximoId,
        document.querySelector("#txtTitulo").value,
        document.querySelector("#txtDescripcion").value,
        document.querySelector("#txtPrecio").value,
        frmEntidad.animal.value,
        document.getElementById("txtRaza").value,
        document.getElementById("txtFechaNacimiento").value,
        document.getElementById("cmb").value);
    }
    else
    {
        alert("Debe completar todos los campos para dar de alta un anuncio");
    }

    return nuevoAnuncio;
}

function bajaAnuncio() 
{
    let idBaja = localStorage.getItem("idSeleccionado");
    let nuevaListaEntidades = [];

    listaEntidades.forEach(element => {
        if (element.id != idBaja) {
            nuevaListaEntidades.push(element);
        }
    });

    listaEntidades = nuevaListaEntidades;
    guardarDatos();
    actualizarLista();
    cancelar();
}

function modificarAnuncio() 
{
    let id = localStorage.getItem("idSeleccionado");

    listaEntidades.forEach(element => {
        if(element.id == id) 
        {
            element.titulo = document.querySelector("#txtTitulo").value;
            element.descripcion = document.querySelector("#txtDescripcion").value;
            element.precio =  document.querySelector("#txtPrecio").value;
            element.animal =  frmEntidad.animal.value;
            element.raza = document.getElementById("txtRaza").value;
            element.fechaNacimiento = document.getElementById("txtFechaNacimiento").value;
            element.vacuna = document.getElementById("cmb").value;
        }
    });

    guardarDatos();
    actualizarLista();
    cancelar();
}

function cancelar() 
{
    document.getElementById("btnAlta").style.display = "block";
    document.getElementById("btnModificar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";
    document.getElementById("btnCancelar").style.display = "none";

    document.forms[0].reset();
}

function obtenerEntidades() {
    return JSON.parse(localStorage.getItem("entidades")) || [];
}

function obtenerProximoId() {
    return JSON.parse(localStorage.getItem("nextId")) || 1;
}

//Guarda el array de personas y el proximo id en el localStorage
function guardarDatos() {
    //En storage solo se pueden guardar strings
    localStorage.setItem("entidades", JSON.stringify(listaEntidades));
    //Guardo el proximo id
    localStorage.setItem("nextId", proximoId);
}

//En cada alta, baja y modificacion tengo que actualizar la tabla
//Construye la tabla con la lista de personas actual
function actualizarLista() {
     
    //Muestro el spinner y luego de 1.5 segundos se ejecuta la funcion y dejo de mostrarlo
    document.getElementById("spinner").style.display = "block";
    document.getElementById("divTabla").style.display = "none";

    //The setTimeout() method calls a function or evaluates an expression after a specified number of milliseconds.
    setTimeout(() => {

        document.getElementById("spinner").style.display = "none";

        //Vacio la tabla.
        //La primera vez que se ejecuta actualizarLista nunca se entra a esta funcion
        while(tabla.firstChild) {
            tabla.removeChild(tabla.lastChild);          
        }
        
        //La vuelvo a crear con los contenidos nuevos
        tabla.appendChild(crearTabla(listaEntidades));

        document.getElementById("divTabla").style.display = "block";

    }, 3000);
}

function obtenerEntidadPorId(id) 
{
    let entidad = null;

    listaEntidades.forEach(element => {
        if (element.id == id) {
            entidad = element;
        }
    });

    return entidad;
}

/*
*********************************
*       FUNCIONES TABLA         *
*********************************
*/

//Recibe un array de cualquier objeto y te devuelve una tabla con todos los objetos cargados.
//En la primera table row, los th se cargan con las claves (id, nombre, apellido)
//En el tbody se cargan los tr con sus tds con los valores de las claves de cada objeto
//Esta funcion llama a las otras 2 y despues le agregamos manejadores a la tabla
//Esta funcion luego es llamada por otra que recibe la tabla que devuelve y la inyecta en el html
function crearTabla(lista) 
{
    //document refiera al index.html
    const tabla = document.createElement("table");

    //Le paso un elemento del vector para que agarre las claves y arme la cabecera
    tabla.appendChild(crearCabecera(lista[0]));

    //La funcion que crea el cuerpo necesita toda la lista
    tabla.appendChild(crearCuerpo(lista));

    return tabla;
}

//Devuelve una cabecera(thead) con las claves(keys) de ese item. 
function crearCabecera(item) 
{
    //Creo la cabecera que voy a retornar al final de la funcion
    const thead = document.createElement("thead");
    //Una cabecera tiene una sola table row
    const tr = document.createElement("tr");

    //Recorro el item para leerle las claves/keys (ej: id, first_name, last_name, etc) no el valor sino el nombre de la llave
    for (const key in item) {
        const th = document.createElement("th");
        const texto = document.createTextNode(key);

        //Le enchufo el texto al th
        th.appendChild(texto);

        //Otra forma de hacerlo:
        //th.textContent = key;

        //Lleno la fila con los nombres de las claves
        tr.appendChild(th);
    }

    //Una vez que tengo la fila completa con toda la info se la enchufo a la cabecera de la tabla
    thead.appendChild(tr);

    return thead;
}

//Retorna un tbody
function crearCuerpo(lista) 
{
    const tbody = document.createElement("tbody");

    //Para cada objeto de la lista ejecuta la funcion anonima
    lista.forEach(element => {
        const tr = document.createElement("tr");

        //Iteramos tantas veces como atributos tenga el objeto. Para cada uno de ellos creo una celda, un table data y le inyecto un valor
        for (const key in element) {
            const td = document.createElement("td");

            const texto = document.createTextNode(element[key]);
            td.appendChild(texto);
            tr.appendChild(td);
        }

        //Esta parte es para obtener el id cuando se clickea la tr de la tabla
        if (element.hasOwnProperty("id")) {
            //Le seteas un atributo de id a la table row para que despues cuando hagas click sobre ella te devuelva el id correspondiente a esa fila
            tr.setAttribute("data-id", element["id"]);
            //Tambien se puede hacer asi
            //tr.dataset.id = element["id"];
        }
        agregarManejadorTR(tr);

        //Agrego la fila con la info del objeto al cuerpo de la tabla
        tbody.appendChild(tr);
    });

    return tbody;
}

function agregarManejadorTR(tr) {
    //Valido tr que no sea nulo
    if (tr) {
        //El manejador del evento click se le agrega a la table row. Se dispara cada vez que se haga click sobre una table row
        tr.addEventListener("click", function (e) {

            localStorage.setItem("idSeleccionado", e.target.parentNode.dataset.id);

            //Muestro la info de la persona seleccionada por consola. Esto es para testear
            console.log("ID seleccionado: ", localStorage.getItem("idSeleccionado"));
            console.log(obtenerEntidadPorId(localStorage.getItem("idSeleccionado")));

            //Obtengo a la persona a traves del id seleccionado
            const entidadObtenida = obtenerEntidadPorId(localStorage.getItem("idSeleccionado"));

            //Relleno el formulario con los datos de la persona seleccionada
            document.querySelector("#txtTitulo").value = entidadObtenida.titulo;
            document.querySelector("#txtDescripcion").value = entidadObtenida.descripcion;
            document.querySelector("#txtPrecio").value = entidadObtenida.precio;
            document.getElementById("txtRaza").value = entidadObtenida.raza;
            document.getElementById("txtFechaNacimiento").value = entidadObtenida.fechaNacimiento;
            document.getElementById("cmb").value = entidadObtenida.vacuna;

            if (entidadObtenida.animal == "perro") {
                document.getElementById("rdoPerro").checked = true;
            }
            else {
                document.getElementById("rdoGato").checked = true;
            }

            //Escondo el boton de alta y muestro los demas
            document.getElementById("btnAlta").style.display = "none";
            document.getElementById("btnModificar").style.display = "block";
            document.getElementById("btnEliminar").style.display = "block";
            document.getElementById("btnCancelar").style.display = "block";
        });
    }
}
