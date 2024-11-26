import { Clientes } from "src/module/clientes/schema/clientes.schema";

export interface IProductos {
    id?: string;
    nombre_producto?: string;
    cantidad?: number;
    precio?: number;
    cliente?: string[];
    proveedor?: string[];
    activo?: boolean;
}
