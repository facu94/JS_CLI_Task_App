const fs = require('fs');
const consoleArgs = process.argv;

let archivoURL = "./tareas.json";

console.log("Aplicación de Tareas");

consoleArgs.splice(0, 2);
let opcion = consoleArgs.shift();


switch (opcion) {
    case /-c|crear/i.test(opcion):      
        crearTarea(consoleArgs);
        break;
    case /-d|eliminar/i.test(opcion):
        borrarTarea(consoleArgs);
        break;
    case /-u|cambiarURL/i.test(opcion):
        cambiarURL(consoleArgs);
        break;
    case /-i|import/i.test(opcion):
        importTarea(consoleArgs);
        break;
    case /-l|listar/i.test(opcion):
        listarTodas(archivoURL, opcion);
        break;
    case undefined:
        listarTodas(archivoURL);
        break;
    case /-h|help/i.test(opcion):
        mostrarAyuda();
    case /-a|about/i.test(opcion):
        acercaDe();
        break;
    default:
        opcionDesconocida();
        break;
}

function textFrame(stringArray) {
    console.log("-".repeat(30));

    for (let line in stringArray) {
        console.log(line);
    }

    console.log("-".repeat(30));
}

function crearTarea(args) {
    if (args.length != 2) {
        let text = [];
        text.push("ERROR");
        text.push("Se esperan solo un TÍTULO y una DESCRIPCIÓN de la nueva tarea.");
        textFrame(text);
        mostrarAyuda("-c");
    }



}

function Tarea(titulo, descripcion, fecha, estado) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = (typeof(fecha) == "undefined") ? new Date() : new Date(fecha);
    this.estado = estado;
}

const arrayTareas = [];
let hoy = new Date();
let t1 = [
    "Practicar el Switch",
    "Entender como funciona",
    ,
    "Terminado"
];

let t2 = [
    "Practicar el For",
    "Entender como hacerlo",
    hoy,
    "Pendiente"
];

let t3 = [
    "Practicar el While",
    "Entender como funciona",
    "1984-10-10",
    "Pendiente"
];
arrayTareas.push(new Tarea(...t1));
arrayTareas.push(new Tarea(...t2));
arrayTareas.push(new Tarea(...t3));

/*
for (let tarea of arrayTareas) {
    fs.writeFileSync("./tareas.json", JSON.stringify(tarea));
}
*/


function listarTodas(fileURL, estado=null) {
    let arrayTareas = fs.readFileSync(fileURL, "utf-8");
    arrayTareas = JSON.parse(arrayTareas);

    for (let arg of arrayTareas) {
        if (estado === null || arg.estado === estado) {
            console.log("-------------------------");
            for (let tarea in arg) {
                console.log(tarea, arg[tarea]);
            }
        }
    }
}

listarTodas(archivoURL);