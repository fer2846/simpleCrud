import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    iconos: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    }
}));

const urlApi = 'http://localhost:4500/'

const Employees = () => {

    const styles = useStyles();

    const [employees, setEmployees] = useState([]);
    const [insertar, setInsertar] = useState(false);
    const [editar, setEditar] = useState(false);
    const [eliminar, setEliminar] = useState(false);

    const [selectEmployee, setSelectEmployee] = useState({
        name: '',
        birthday: '',
        address: '',
        phone: '',
        status: ''
    })

    const handleChange = e => {
        const { name, value } = e.target;
        setSelectEmployee(prevState => ({
            ...prevState,
            [name]: value
        }))
        console.log(selectEmployee);
    }

    //Todas las peticiones
    const getEmployees = async () => {
        await axios.get(urlApi)
            .then(response => {
                setEmployees(response.data)
            })
    }

    const peticionPost = async () => {
        await axios.post(urlApi, selectEmployee)
            .then(response => {
                setEmployees(employees.concat(response.data))
                modalInsertar()
            })
    }

    const peticionPut = async () => {
        await axios.put(urlApi + selectEmployee.id, selectEmployee)
            .then(response => {
                var newEmployee = employees;
                newEmployee.map(employee => {
                    if (selectEmployee.id === employee.id) {
                        employee.name = selectEmployee.name;
                        employee.birthday = selectEmployee.birthday;
                        employee.address = selectEmployee.address;
                        employee.phone = selectEmployee.phone;
                        employee.status = selectEmployee.status;
                    }
                })
                setEmployees(newEmployee);
                modalEditar();
            })
    }

    const peticionDelete = async () => {
        await axios.delete(urlApi + selectEmployee.id)
            .then(response => {
                setEmployees(employees.filter(employee => employee.id !== selectEmployee.id));
                modalEliminar();
            })
    }

    useEffect(async () => {
        getEmployees();
    }, [])

    const modalInsertar = () => {
        setInsertar(!insertar);
    }

    const modalEditar = () => {
        setEditar(!editar);
    }

    const modalEliminar = () => {
        setEliminar(!eliminar);
    }

    const selectAnEmployee = (employee, caso) => {
        setSelectEmployee(employee);
        (caso === 'Editar') ? modalEditar() : modalEliminar()
    }

    //Body's
    const bodyInsertar = (
        <div className={styles.modal}>
            <h3>Agregar un nuevo empleado</h3>
            <TextField name="name" className={styles.inputMaterial} label="Name" onChange={handleChange} />
            <br />
            <TextField name="birthday" className={styles.inputMaterial} label="Birthday" onChange={handleChange} />
            <br />
            <TextField name="address" className={styles.inputMaterial} label="Address" onChange={handleChange} />
            <br />
            <TextField name="phone" className={styles.inputMaterial} label="Phone" onChange={handleChange} />
            <br />
            <TextField name="status" className={styles.inputMaterial} label="Status" onChange={handleChange} />
            <br /><br />
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
                <Button onClick={() => modalInsertar()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyEditar = (
        <div className={styles.modal}>
            <h3>Editar Consola</h3>
            <TextField name="name" className={styles.inputMaterial} label="Name" onChange={handleChange} value={selectEmployee && selectEmployee.name} />
            <br />
            <TextField name="birthday" className={styles.inputMaterial} label="Birthday" onChange={handleChange} value={selectEmployee && selectEmployee.birthday} />
            <br />
            <TextField name="address" className={styles.inputMaterial} label="Address" onChange={handleChange} value={selectEmployee && selectEmployee.address} />
            <br />
            <TextField name="phone" className={styles.inputMaterial} label="Phone" onChange={handleChange} value={selectEmployee && selectEmployee.phone} />
            <br />
            <TextField name="status" className={styles.inputMaterial} label="Status" onChange={handleChange} value={selectEmployee && selectEmployee.status} />
            <br /><br />
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>Editar</Button>
                <Button onClick={() => modalEditar()}>Cancelar</Button>
            </div>
        </div>
    )

    const bodyEliminar = (
        <div className={styles.modal}>
            <p>Estás seguro que deseas eliminar la consola <b>{selectEmployee && selectEmployee.name}</b> ? </p>
            <div align="right">
                <Button color="secondary" onClick={() => peticionDelete()} >Sí</Button>
                <Button onClick={() => modalEliminar()}>No</Button>

            </div>

        </div>
    )

    return (
        <div className="">
            <br />
            <Button onClick={() => modalInsertar()}>Nuevo Empleado</Button>
            <br /><br />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Fecha Nacimiento</strong></TableCell>
                            <TableCell><strong>Domicilio</strong></TableCell>
                            <TableCell><strong>Telefono Celular</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {employees.map(empleado => (
                            <TableRow key={empleado.idEmployee}>
                                <TableCell>{empleado.employeeName}</TableCell>
                                <TableCell>{empleado.birthday}</TableCell>
                                <TableCell>{empleado.addressEmployee}</TableCell>
                                <TableCell>{empleado.phoneEmployee}</TableCell>
                                <TableCell>{empleado.statusEmployee}</TableCell>
                                <TableCell>
                                    <Edit className={styles.iconos} onClick={() => selectAnEmployee(empleado, 'Editar')} />
                                    &nbsp;&nbsp;&nbsp;
                                    <Delete className={styles.iconos} onClick={() => selectAnEmployee(empleado, 'Eliminar')} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={insertar}
                onClose={modalInsertar}>
                {bodyInsertar}
            </Modal>

            <Modal
                open={editar}
                onClose={modalEditar}>
                {bodyEditar}
            </Modal>

            <Modal
                open={eliminar}
                onClose={modalEliminar}>
                {bodyEliminar}
            </Modal>
        </div>
    )
}

export default Employees;