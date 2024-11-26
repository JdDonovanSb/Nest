
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
import { ProductosServices } from '../services/productos.services';
import { CreateProductoDto } from '../dto/create-productos.dto';
import { UpdateProductosDto } from '../dto/udpate-productos.dto';
import { Productos } from '../schema/productos.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('PRODUCTOS')
@Controller('productos')
export class ProductosControllers {
    constructor(private readonly productosServices: ProductosServices) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto creado con éxito' })
    @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
    @ApiBody({
        description: 'Datos necesarios para crear un producto',
        examples: {
            example: {
                summary: 'Ejemplo de creación de producto',
                value: {
                    nombre_producto: 'Producto A',
                    cantidad: 100,
                    precio: 50.5,
                    proveedor: ['Proveedor1', 'Proveedor2'],
                    cliente: ['Cliente1', 'Cliente2'],
                    activo: true
                },
            },
        },
    })
    async create(@Body() createProductoDto: CreateProductoDto): Promise<Productos> {
        return this.productosServices.createProducto(createProductoDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto encontrado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiParam({
        name: 'id',
        description: 'ID del producto que deseas obtener',
        type: String,
    })
    async findOne(@Param('id') id: string): Promise<Productos> {
        return await this.productosServices.findOne(id);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener la lista de todos los productos' })
    @ApiResponse({ status: 200, description: 'Lista de productos obtenida con éxito' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async findAll(): Promise<Productos[]> {
        try {
            return await this.productosServices.findAllProdutos();
        } catch (error) {
            throw new NotFoundException('No se pudieron obtener los productos');
        }
    }
    
    @Put('update/:id')
    @ApiOperation({ summary: 'Actualizar un producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto actualizado con éxito' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiBody({
        description: 'Datos necesarios para actualizar un producto',
        examples: {
            example: {
                summary: 'Ejemplo de actualización de producto',
                value: {
                    nombre_producto: 'Producto A Actualizado',
                    cantidad: 120,
                    precio: 60.0,
                    proveedor: ['Proveedor3'],
                    cliente: ['Cliente3'],
                    activo: false
                },
            },
        },
    })
    async update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductosDto): Promise<Productos> {
        const updatedProducto = await this.productosServices.update(id, updateProductoDto);
        if (!updatedProducto) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return updatedProducto;
    }

    @Patch('updatePartial/:id')
    @ApiOperation({ summary: 'Actualizar parcialmente un producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto actualizado parcialmente con éxito' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiBody({
        description: 'Datos necesarios para una actualización parcial del producto',
        examples: {
            example: {
                summary: 'Ejemplo de actualización parcial',
                value: {
                    precio: 45.0,
                    activo: true
                },
            },
        },
    })
    async updatePartial(@Param('id') id: string, @Body() updateProductoDto: Partial<UpdateProductosDto>): Promise<Productos> {
        const updatedPartialProducto = await this.productosServices.updatePartial(id, updateProductoDto);
        if (!updatedPartialProducto) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return updatedPartialProducto;
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Eliminar un producto por ID' })
    @ApiResponse({ status: 204, description: 'Producto eliminado con éxito' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiParam({
        name: 'id',
        description: 'ID del producto que deseas eliminar',
        type: String,
    })
    async remove(@Param('id') id: string): Promise<void> {
        await this.productosServices.delete(id);
    }

    @Put('deactivate/:id')
    @ApiOperation({ summary: 'Desactivar un producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto desactivado con éxito' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiParam({
        name: 'id',
        description: 'ID del producto que deseas desactivar',
        type: String,
    })
    async deactivate(@Param('id') id: string): Promise<void> {
        await this.productosServices.deactive(id);
    }

    @Put('activate/:id')
    @ApiOperation({ summary: 'Activar un producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto activado con éxito' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiParam({
        name: 'id',
        description: 'ID del producto que deseas activar',
        type: String,
    })
    async activate(@Param('id') id: string): Promise<void> {
        await this.productosServices.active(id);
    }
}
