class Anuncio
{
    id;
    titulo;
    transaccion;
    descripcion;
    precio

    constructor(id, titulo, descripcion, precio)
    {
        this.id = id;
        this.titulo = titulo;
        this.transaccion = "venta";
        this.descripcion = descripcion;
        this.precio = precio;
    }
}

export class Anuncio_Mascota extends Anuncio
{
    animal;
    raza;
    fechaNacimiento;
    vacuna;

    constructor(id, titulo, descripcion, precio, animal, raza, fechaNacimiento, vacuna)
    {
        super(id, titulo, descripcion, precio);
        this.animal = animal;
        this.raza = raza;
        this.fechaNacimiento = fechaNacimiento;
        this.vacuna = vacuna;
    }
}