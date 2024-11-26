import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosServices } from './services/productos.services';
import { ProductosControllers } from './controllers/productos.controllers';
import { Productos, ProductoSchema } from './schema/productos.schema';
import { ProveedoresModule } from '../proveedores/proveedores.module';
import { ProveedoresServices } from '../proveedores/service/proveedores.service';
import { ClientesModule } from '../clientes/clientes.module';


@Module({
    imports:[MongooseModule.forFeature([{name: Productos.name,schema: ProductoSchema,}]),
    ProveedoresModule,
    ClientesModule,

],
    controllers:[ProductosControllers],
    providers:[ProductosServices],
    //exports:[ProductosServices]
    
})
export class ProductosModule {}
