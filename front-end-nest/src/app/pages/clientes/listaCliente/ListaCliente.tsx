'use client';
import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-8px)",
    },
    width: "100%",
    marginBottom: theme.spacing(3),
    borderRadius: "20px",
    backgroundColor: "#DCDEF1FF",
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
        width: "500px",
        margin: "auto",
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(1.5),
    fontSize: "0.875rem",
    fontWeight: "bold",
    textTransform: "none",
    borderRadius: "10px",
    transition: "background-color 0.3s ease",
}));

const ActivateButton = styled(ActionButton)({
    backgroundColor: "#29492BFF",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#0C380EFF",
    },
});

const DeactivateButton = styled(ActionButton)({
    backgroundColor: "#524839FF",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#E28425FF"
    },
});

const DeleteButton = styled(ActionButton)({
    backgroundColor: "#f44336",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#E61F1FFF"
    },
});

const UpdateButton = styled(ActionButton)({
    backgroundColor: "#5BA1DAFF",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#0881FAFF",
    },
});

const ClienteLista = () => {
    const [clientes, setClientes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        nombre_cliente: "",
        email_cliente: "",
        celular_cliente: "",
        activo_cliente: true,
    });
    const [selectedCliente, setSelectedCliente] = useState<any>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [actionType, setActionType] = useState<'create' | 'update'>('create');

    const fetchClientes = async () => {
        try {
            const respuesta = await fetch('http://localhost:3001/api/clientes');
            if (!respuesta.ok) throw new Error('Error al obtener todos los clientes');
            const data = await respuesta.json();
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener los clientes: ', error);
            setErrorMessage('Error al obtener los clientes');
            setOpenSnackbar(true);
        }
    }

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleOpenModal = (cliente: any = null) => {
        setSelectedCliente(cliente);
        if (cliente) {
            setFormValues({
                nombre_cliente: cliente.nombre_cliente,
                email_cliente: cliente.email_cliente,
                celular_cliente: cliente.celular_cliente,
                activo_cliente: cliente.activo_cliente,
            });
            setActionType('update');
        } else {
            setFormValues({
                nombre_cliente: "",
                email_cliente: "",
                celular_cliente: "",
                activo_cliente: true,
            });
            setActionType('create');
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCliente(null);
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSaveCliente = async () => {
        try {
            let url;
            let method;
            if (actionType === 'create') {
                url = 'http://localhost:3001/api/clientes';
                method = 'POST';
            } else if (actionType === 'update') {
                url = `http://localhost:3001/api/clientes/update/${selectedCliente._id}`;
                method = 'PUT';
            }

            const response = await fetch(`${url}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el cliente');
            }
            fetchClientes();
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar el cliente:", error);
            setErrorMessage("Error al guardar el cliente");
            setOpenSnackbar(true);
        }
    };

    const handleActivate = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/clientes/active/${id}`, { method: 'PUT' });
            fetchClientes();
        } catch (error) {
            console.error("Error al activar el cliente:", error);
        }
    };

    const handleDeactivate = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/clientes/deactivate/${id}`, { method: 'PUT' });
            fetchClientes();
        } catch (error) {
            console.error("Error al desactivar el cliente: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/clientes/delete/${id}`, { method: 'DELETE' });
            fetchClientes();
        } catch (error) {
            console.error("Error al eliminar el cliente: ", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorMessage("");
    }

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
          background: "linear-gradient(135deg, #D8BCF5FF 0%, #A9CEC8FF 100%)",
          paddingBottom: "20px",
        }}
      >
            <section style={{
                background: "linear-gradient(135deg, #51636BFF 0%, #285DBABF 100%)",
                padding: "50px",
                borderRadius: "100px",
                color: "#fff"
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal()}
                    style={{ marginBottom: "20px" }}
                >
                    Crear Cliente
                </Button>
                <Grid container spacing={4}>
                    {clientes.map((cliente: any) => (
                        <Grid item xs={12} md={6} key={cliente.id}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {cliente.nombre_cliente}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        Email: {cliente.email_cliente}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        Celular: {cliente.celular_cliente}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        style={{
                                            color: cliente.activo_cliente ? "#50A553FF" : "#8E504CFF",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {cliente.activo_cliente ? "Activo" : "Desactivado"}
                                    </Typography>
                                    <UpdateButton onClick={() => handleOpenModal(cliente)}>
                                        Actualizar
                                    </UpdateButton>
                                    {cliente.activo_cliente ? (
                                        <DeactivateButton onClick={() => handleDeactivate(cliente._id)}>
                                            Desactivar
                                        </DeactivateButton>
                                    ) : (
                                        <ActivateButton onClick={() => handleActivate(cliente._id)}>
                                            Activar
                                        </ActivateButton>
                                    )}
                                    <DeleteButton onClick={() => handleDelete(cliente._id)}>
                                        Eliminar
                                    </DeleteButton>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </section>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{actionType === "create" ? "Crear Cliente" : "Actualizar Cliente"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nombre"
                        name="nombre_cliente"
                        value={formValues.nombre_cliente}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email_cliente"
                        value={formValues.email_cliente}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Celular"
                        name="celular_cliente"
                        value={formValues.celular_cliente}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
                    <Button onClick={handleSaveCliente} color="primary">
                        {actionType === "create" ? "Crear" : "Actualizar"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ClienteLista;
