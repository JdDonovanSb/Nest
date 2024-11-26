import ProductosLista from "./listaProductos/ListaProductos";

export default function ProductosPage() {
  // Aquí puedes definir un productId para pasar al componente

  return (
    <div>
      {/* Renderiza el componente de gestión de proveedores y clientes */}
      <ProductosLista />
    </div>
  );
}