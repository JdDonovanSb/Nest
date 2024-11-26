import ClienteLista from "./listaCliente/ListaCliente";

export default function ProductosPage() {
    // Aquí puedes definir un productId para pasar al componente

    return (
        <div>
            {/* Renderiza el componente de gestión de proveedores y clientes */}
            <ClienteLista />
        </div>
    );
}