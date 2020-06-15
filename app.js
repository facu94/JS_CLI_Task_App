const fs = require('fs'); //Módulo FileSystem
const consoleArgs = process.argv; //array con ingreso por consola

let archivoURL = "./tareas.json"; //URL del archivo que persiste tareas

//Muestro titulo por consola
textFrame("\nAplicación de Tareas - JS CLI\n");

consoleArgs.splice(0, 2);   //Elimino primeros 2 elementos del array
let opcion = consoleArgs.shift();   //La opción debe estar en el primer elemento

//Selección en base a opción ingresada
switch (opcion) {
    case "-c":      
        crearTarea(consoleArgs);
        break;
    case "-d":
        borrarTarea(consoleArgs);
        break;
    case "-u":
        cambiarURL(consoleArgs);
        break;
    case "-i":
        importTarea(consoleArgs);
        break;
    case "-l":
        listarTodas(archivoURL, ...consoleArgs);
        break;
    case undefined:
        listarTodas(archivoURL);
        break;
    case "-h":
        mostrarAyuda();
    case "-a":
        acercaDe();
        break;
    default:
        opcionDesconocida();
        break;
}

//función para salida por consola
function textFrame(stringArray) {
    console.log("-".repeat(30));

    if (typeof (stringArray) != "string") {
        for (let line of stringArray) {
            console.log(line);
        }
    }
    else {
        console.log(stringArray);
    }

    console.log("-".repeat(30));
}

//Crea tarea nueva y la guarda en el archivo
function crearTarea(args) {
    //Compruebo que la cantidad de argumentos sea correcta
    //Muestro error para corregir la entrada
    if (args.length != 2) {
        const text = [];
        text.push("ERROR");
        text.push("Se esperan solo un TÍTULO y una DESCRIPCIÓN de la nueva tarea.");
        textFrame(text);
        mostrarAyuda("-c");
        return false;
    }

    //Creo la tarea nueva; Estado Pendiente, fecha Hoy
    const hoy = new Date();
    const nuevaTarea = new Tarea(args[0], args[1], hoy, "Pendiente");

    //Traigo las tareas del archivo
    let arrayTareas = getTareas(archivoURL);
    
    //Agrego la nueva tarea
    arrayTareas.push(nuevaTarea);

    //Guardo el Archivo
    setTareas(archivoURL, arrayTareas);

    //Muestro, operación exitosa
    let lines = [
        "OPERACIÓN EXITOSA",
        "Su tarea se creó con éxito."
    ];
    lines.push(...nuevaTarea.mostrar())
    textFrame(lines);
}

//Elimina tareas del archivo por titulo
function borrarTarea(args) {
    //Traigo tareas del archivo
    let tareas = getTareas(archivoURL);

    //Saco el titulo de los argumentos
    let tituloTarea = args[0].toLowerCase();

    //Buscar tarea a eliminar
    let arrayTareas = [... tareas];
    let tareaFiltrada = filtrarTareas(arrayTareas, "Tareas", tituloTarea);
    
    //Eliminar Tarea
    let index = arrayTareas.indexOf(tareaFiltrada);
    arrayTareas.splice(index, 1);

    //Guardo las tareas en el archivo.
    setTareas(archivoURL, arrayTareas);
}
//Constructor de objetos Tarea
function Tarea(titulo, descripcion, fecha, estado) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = (typeof(fecha) == "undefined") ? new Date() : new Date(fecha);
    this.estado = estado;
    //String Array para mostrar tarea
    this.mostrar = function () {
        return [
            "Título: " + this.titulo,
            "Descripción: " + this.descripcion,
            "Fecha: " + this.fecha,
            "Estado: " + this.estado
        ];
    }
}

//Trae tareas del archivo y retorna un array
function getTareas(fileURL) {
    let arrayTareas = fs.readFileSync(fileURL, "utf-8");
    if (arrayTareas === "") {
        return [];
    }
    arrayTareas = JSON.parse(arrayTareas);
    return arrayTareas;
}

//Guarda un array en archivo
function setTareas(fileURL, arrayTareas) {
    fs.writeFileSync(fileURL, JSON.stringify(arrayTareas));
}

function listarTodas(fileURL, filtrarPor = "", filtro = "") {
    //Traigo las tareas del archivo
    let arrayTareas = getTareas(fileURL);

    //Filtrar Tareas
    if (filtrarPor !== "" | filtro !== "") {
        arrayTareas = filtrarTareas(arrayTareas, filtrarPor, filtro);
    }

    //Si no hay tareas que mostrar...
    if (arrayTareas.length === 0) {
        textFrame("\nNo hay tareas...\n");
        return false;
    }

    //Muestro tareas
    for (let tarea of arrayTareas) {
        let thisTarea = new Tarea(tarea.titulo, tarea.descripcion, tarea.fecha, tarea.estado);
        textFrame(thisTarea.mostrar());
    }
    return true;
}

//Filtra las tareas de un array segun parametros
function filtrarTareas(arrayTareas, filtrarPor, filtro) {
    return arrayTareas.filter((element) => {
        let argumento = element[filtrarPor.toLowerCase()];
        let regExp = new RegExp(filtro.toLowerCase(), "i");
        return regExp.test(argumento);
    }
    );
}