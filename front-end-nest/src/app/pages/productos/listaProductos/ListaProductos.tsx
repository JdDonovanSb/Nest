'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Productos } from '@/app/types/Producto.type';
import { Proveedores } from '@/app/types/Proveedor.type';
import { Clientes } from '@/app/types/Clientes.type';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import Tooltip from '@mui/material/Tooltip';
import { SelectChangeEvent } from '@mui/material/Select';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

// Estilo del modal
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ProductoLista: React.FC = () => {
  const [productos, setProductos] = useState<Productos[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState<Omit<Productos, '_id'>>({
    nombre_producto: '',
    cantidad: 0,
    precio: 0,
    proveedor: [],
    cliente: [],
    activo: true,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [productoEditado, setProductoEditado] = useState<Productos | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [clientes, setClientes] = useState<Clientes[]>([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState<string[]>([]);
  const [proveedores, setProveedores] = useState<Proveedores[]>([]);
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState<string[]>([]);

  const obtenerClientes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const obtenerProveedores = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/proveedores');
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const crearProducto = async (data: Omit<Productos, '_id'>) => {
    try {
      const response = await fetch('http://localhost:3001/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setNuevoProducto({ nombre_producto: '', cantidad: 0, precio: 0, proveedor: [], cliente: [], activo: true });
        setOpenModal(false);
        obtenerProductos();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error al crear producto');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const eliminarProducto = async (id: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3583CCFF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3001/api/productos/delete/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
            obtenerProductos();
          } else {
            setErrorMessage('Error al eliminar producto');
            setOpenSnackbar(true);
          }
        } catch (error) {
          console.error('Error al eliminar producto:', error);
        }
      }
    });
  };

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/productos/${activo ? 'deactivate' : 'activate'}/${id}`,
        { method: 'PUT' }
      );

      if (response.ok) {
        obtenerProductos();
      } else {
        setErrorMessage('Error al cambiar el estado del producto');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error al cambiar el estado del producto:', error);
    }
  };

  const actualizarProducto = async (id: string, data: Omit<Productos, '_id'>) => {
    try {
      const response = await fetch(`http://localhost:3001/api/productos/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        obtenerProductos();
        setOpenEditModal(false);
        setProductoEditado(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error al actualizar producto');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const handleClienteChange = (event: SelectChangeEvent<string[]>) => {
    setClientesSeleccionados(event.target.value as string[]);
  };

  const handleProveedorChange = (event: SelectChangeEvent<string[]>) => {
    setProveedoresSeleccionados(event.target.value as string[]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev!,
      [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productoData = {
      ...nuevoProducto,
      cliente: clientesSeleccionados.map((id) => obtenerClientePorId(id)),
      proveedor: proveedoresSeleccionados.map((id) => obtenerProveedorPorId(id)),
    };
    crearProducto(productoData);
  };

  const obtenerClientePorId = (id: string): Clientes =>
    clientes.find((cliente) => cliente.id_cliente === id)!;

  const obtenerProveedorPorId = (id: string): Proveedores =>
    proveedores.find((proveedor) => proveedor.id_proveedor === id)!;

  useEffect(() => {
    obtenerProductos();
  }, []);

  useEffect(() => {
    if (openModal) {
      obtenerClientes();
      obtenerProveedores();
    }
  }, [openModal]);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => setOpenModal(false);

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setProductoEditado(null);
  };

  const handleOpenEditModal = (producto: Productos) => {
    setProductoEditado(producto);
    setOpenEditModal(true);
  };

  return (
    <Container
      maxWidth='lg'
      style={{
        marginTop: "70px",
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #9A84AFFF 0%, #3F5A89FF 100%)",
        paddingBottom: "20px",
      }}
    >
      <section style={{ width: '100%', position: 'relative' }}>
        <Typography variant="h4" style={{ marginBottom: "30px", textAlign: "center", color: "#fff" }}>
          Lista de Productos
        </Typography>

        {/* Botón para abrir el modal de agregar producto */}
        <Button
          variant="contained"
          onClick={handleOpenModal}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "#531992FF",
            color: "#fff",
          }}
        >
          <AddIcon /> Agregar Producto
        </Button>
      </section>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "#052D72FF" }}>Nombre del Producto</TableCell>
              <TableCell style={{ color: "#052D72FF" }}>Cantidad</TableCell>
              <TableCell style={{ color: "#052D72FF" }}>Precio</TableCell>
              <TableCell style={{ color: "#052D72FF" }}>Estado</TableCell>
              <TableCell style={{ color: "#052D72FF" }}>Clientes Asociados</TableCell>
              <TableCell style={{ color: "#052D72FF" }}>Proveedores Asociados</TableCell>
              <TableCell style={{ color: "#052D72FF" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(productos) && productos.length > 0 ? (
              productos.map((producto) => (
                <TableRow key={producto._id}>
                  <TableCell>{producto.nombre_producto}</TableCell>
                  <TableCell>{producto.cantidad}</TableCell>
                  <TableCell>${producto.precio}</TableCell>
                  <TableCell>
                    <span style={{ color: producto.activo ? "green" : "red", fontWeight: "bold" }}>
                      {producto.activo ? "Activo" : "Desactivado"}
                    </span>
                  </TableCell>
                  <TableCell>{producto.proveedor}</TableCell>
                  <TableCell>{producto.cliente}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar producto">
                      <Button onClick={() => handleOpenEditModal(producto)}>
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title={producto.activo ? "Desactivar" : "Activar"}>
                      <Button
                        onClick={() => toggleActivo(producto._id, producto.activo ?? false)}
                        style={{
                          backgroundColor: producto.activo ? "green" : "red",
                          color: "#fff",
                        }}
                      >
                        {producto.activo ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar producto">
                      <Button onClick={() => eliminarProducto(producto._id)}>
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No hay productos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal para agregar producto */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...style, backgroundColor: 'white', color: 'black', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" component="h2" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
            Agregar Producto
          </Typography>

          {/* Botón de salir */}
          <Button onClick={handleCloseModal} sx={{ position: 'absolute', top: '10px', right: '10px' }}>
            Salir
          </Button>

          <form onSubmit={handleSubmit}>
            {/* Campos de entrada */}
            <TextField
              name="nombre_producto"
              label="Nombre del Producto"
              value={nuevoProducto.nombre_producto}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: 'black' } }}
            />
            <TextField
              name="cantidad"
              label="Cantidad"
              type="number"
              value={nuevoProducto.cantidad}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: 'black' } }}
            />
            <TextField
              name="precio"
              label="Precio"
              type="number"
              value={nuevoProducto.precio}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: 'black' } }}
            />

            {/* Selección de clientes */}
            <FormControl fullWidth margin="normal">
              <InputLabel style={{ color: 'black' }}>Clientes</InputLabel>
              <Select
                multiple
                value={clientesSeleccionados}
                onChange={handleClienteChange}
                renderValue={(selected) =>
                  selected.map((id) => obtenerClientePorId(id)?.nombre_cliente).join(', ')
                }
                sx={{ color: 'black' }}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre_cliente}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Selección de proveedores */}
            <FormControl fullWidth margin="normal">
              <InputLabel style={{ color: 'black' }}>Proveedores</InputLabel>
              <Select
                multiple
                value={proveedoresSeleccionados}
                onChange={handleProveedorChange}
                renderValue={(selected) =>
                  selected.map((id) => obtenerProveedorPorId(id)?.nombre_proveedor).join(', ')
                }
                sx={{ color: 'black' }}
              >
                {proveedores.map((proveedor) => (
                  <MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                    {proveedor.nombre_proveedor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Botón para guardar */}
            <Button variant="contained" type="submit" fullWidth sx={{ marginTop: '20px' }}>
              Guardar Producto
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Modal para editar producto */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" style={{ marginBottom: '16px', color: 'purple' }}>
            Editar Producto
          </Typography>
          {productoEditado && (
            <form onSubmit={(e) => { e.preventDefault(); actualizarProducto(productoEditado._id, productoEditado); }}>
              <TextField
                label="Nombre del Producto"
                name="nombre_producto"
                value={productoEditado.nombre_producto}
                onChange={handleEditChange}
                required
                fullWidth
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label="Cantidad"
                name="cantidad"
                type="number"
                value={productoEditado.cantidad}
                onChange={handleEditChange}
                required
                fullWidth
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label="Precio"
                name="precio"
                type="number"
                value={productoEditado.precio}
                onChange={handleEditChange}
                required
                fullWidth
                style={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="contained" color="primary" style={{ marginRight: '8px' }}>
                Actualizar
              </Button>
              <Button variant="outlined" style={{ backgroundColor: 'red', color: 'white' }} onClick={handleCloseEditModal}>
                Salir
              </Button>
            </form>
          )}
        </Box>
      </Modal>

      {/* Snackbar para mensajes de error */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductoLista;



