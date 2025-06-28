import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function SwaggerConfigInit(app: INestApplication): void {
    const document = new DocumentBuilder()
        .setTitle("Virgool")
        .setDescription("بک اند وب اپلیکیشن ویرگول")
        .setVersion("v0.0.1")
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup("/swagger", app, swaggerDocument)
}