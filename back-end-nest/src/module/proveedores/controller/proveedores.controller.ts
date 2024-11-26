import { 
    Controller, 
    Post, 
    Body, 
    Delete, 
    Param, 
    NotFoundException, 
    Get, 
    Put,
    Patch
} from '@nestjs/common';

import { ProveedoresServices } from '../service/proveedores.service';
import { CreateProveedoresDto } from '../dto/create-proveedores.dto';
import { UpdateProveedoresDto } from '../dto/update-proveedores.dto';
import { Proveedores } from '../schema/proveedores.schema';

// Importacion necesaria para documentar en swagger para los endpoints
import { ApiTags, ApiResponse, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('PROVEEDORES') // Etiqueta para agrupar endpoints en la documentacion
@Controller('proveedores') // Ruta base
export class ProveedoresController{


    constructor(private readonly proveedoresServies: ProveedoresServices)
    {

    }
    


    //Controlador para crear el Proveedor
    @Post()
    // Descripción del endpoint
    @ApiOperation({summary: 'Crear un nuevo proveedor'}) 
    // Respuesta exitosa
    @ApiResponse({status: 201, description: 'El proveedor ha sido creado'}) 
    // Respueta de error
    @ApiResponse({status: 400, description: 'Solicitud incorrecta'})
    // Cuerpo del endpoint
    @ApiBody({
        description: 'Cuerpo de solicitud para crear un nuevo proveedor',
        examples:{
            example:{
                summary: 'Ejemplo de creacion',
                value:{
                    nombre_proveedor: 'Nombre__Proveedor',
                    email_proveedor: 'proveedor@gmail.com',
                    celular_proveedor: '1234567890'
                }
            }
        }
    })
    async craete(@Body() createProveedorDto: CreateProveedoresDto): Promise<Proveedores>{
        return  this.proveedoresServies.createProveedor(createProveedorDto);
    }


    //Controlador para desactivar
    @Put('deactivate/:id')
    //Descripcion del endpoint
    @ApiOperation({summary:'Desctivar un proveedor'})
    //Respuesta exitosa
    @ApiResponse({status: 204, description: 'Proveedor desactivado'})
    //Resíesta de error
    @ApiResponse({status:400, description:'No se encuentra el proveedor'})
    // Respuesta de error
    @ApiResponse({status:404, description:'Solicitud incorrecta'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Id del proveedor que desea desactivar',
        type: String,
    })
    async deactivate(@Param('id') id: string): Promise<void>{
        await this.proveedoresServies.deactivate(id);
    }


     //Controlador para Activar
    @Put('active/:id')
    //Descripcion del endpoint
    @ApiOperation({summary:'Activar un proveedor'})
    //Respuesta exitosa
    @ApiResponse({status: 204, description: 'Proveedor activado'})
    //Resíesta de error
    @ApiResponse({status:400, description:'No se encuentra el proveedor'})
    // Respuesta de error
    @ApiResponse({status:404, description:'Solicitud incorrecta'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Id del proveedor que desea activar',
        type: String,
    })
    async active(@Param('id') id: string): Promise<void>{
        await this.proveedoresServies.active(id);
    }



    //Controlador para eliminar
    @Delete('delete/:id')
        //Descripcion del endpoint
        @ApiOperation({summary:'Eliminar un proveedor'})
        //Respuesta exitosa
        @ApiResponse({status: 204, description: 'Proveedor eliminado'})
        //Respuesta de error
        @ApiResponse({status:400, description:'No se encuentra el proveedor'})
        // Respuesta de error
        @ApiResponse({status:404, description:'Solicitud incorrecta'})
        @ApiParam({
            name: 'id',
            required: true,
            description: 'Id del proveedor que desea eliminar',
            type: String,
        })
    async delete(@Param('id') id: string): Promise<void>{
        await this.proveedoresServies.delete(id);
    }


    //Controlador para obtener todos los proveedores
    @Get()
    //Descripcion endpoint
    @ApiOperation({summary: 'Obtener todos los proveedores'})
    // Respuesta de exito
    @ApiResponse({status:200, description: 'Lista de proveedores ', type:[Proveedores] })
    // Respuesta de error
    @ApiResponse({status: 404, description: 'Paises no encontrados'})
    async findAll(): Promise<Proveedores[]>{
        return await this.proveedoresServies.findAll();
    }


    //Controlador para obtener por id
    @Get(':id')
    //Descripcion del endpoint
    @ApiOperation({summary:'Obtener un proveedor por su Id'})
    //Respuesta exitosa
    @ApiResponse({status: 204, description: 'Proveedor encontrado'})
    //Respuesta de error
    @ApiResponse({status:400, description:'No se encuentra el proveedor'})
    // Respuesta de error
    @ApiResponse({status:404, description:'Solicitud incorrecta'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Id del proveedor que desea obtener',
        type: String,
    })
    async findOne(@Param('id') id: string): Promise<Proveedores>{
        return await this.proveedoresServies.findOne(id)
    }


    //Controlador para actualizar todo el proveedor
    @Put('update/:id')

    // Descripción del endpoint
    @ApiOperation({summary: 'Actualizar de un proveedor'}) 
    // Respuesta exitosa
    @ApiResponse({status: 201, description: 'El proveedor ha sido actualizado'}) 
    // Respueta de error
    @ApiResponse({status: 400, description: 'No se encuentra el proveedor'})
    // Respuesta de error
    @ApiResponse({status:404, description:'Solicitud incorrecta'})
    // Cuerpo del endpoint
    @ApiBody({
        description: 'Cuerpo de solicitud para actualizar un nuevo proveedor',
        examples:{
            example:{
                summary: 'Ejemplo de actualización',
                value:{
                    nombre_proveedor: 'Proveedor_actualizado',
                    email_proveedor: 'proveedorudpate@gmail.com',
                    celular_proveedor: '1234567'
                }
            }
        }
    })
    
    async update(@Param('id') id: string, @Body() updateProveedoresDto: UpdateProveedoresDto): Promise<Proveedores>{
        const updateProveedor = await this.proveedoresServies.update(id, updateProveedoresDto);
        if(!updateProveedor){
            throw new NotFoundException(`Proveedor con Id ${id} no se encontro`);
        }
        return updateProveedor;
    }

    @Patch('updatePartial/:id')
    // Descripción del endpoint
    @ApiOperation({summary: 'Actualizar de un proveedor parcialmente'}) 
    // Respuesta exitosa
    @ApiResponse({status: 201, description: 'El proveedor ha sido actualizado'}) 
    // Respueta de error
    @ApiResponse({status: 400, description: 'No se encuentra el proveedor'})
    // Respuesta de error
    @ApiResponse({status:404, description:'Solicitud incorrecta'})
    // Cuerpo del endpoint
    @ApiBody({
        description: 'Cuerpo de solicitud para actualizar un nuevo proveedor',
        examples:{
            example:{
                summary: 'Ejemplo de actualización',
                value:{
                    nombre_proveedor: 'Proveedor_actualizacionParcial',
                    email_proveedor: 'proveedorudpateparcial@gmail.com',
                    celular_proveedor: '12345674354'
                }
            }
        }
    })
    async updatePartial(@Param('id') id: string, @Body() updateProveedoresDto: UpdateProveedoresDto): Promise<Proveedores>{
        const updatePartialProveedor = await this.proveedoresServies.updatePartial(id, updateProveedoresDto);
        if(!updatePartialProveedor){
            throw new NotFoundException(`Proveedor con Id ${id} no se encontro`);
        }
        return updatePartialProveedor;
    }

}
