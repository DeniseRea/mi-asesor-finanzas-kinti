"use strict";
<<<<<<< HEAD
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTicketMessageDto = exports.CreateTicketDto = void 0;
const class_validator_1 = require("class-validator");
class CreateTicketDto {
    usuario_id;
    asunto;
    contexto;
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "usuario_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "asunto", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "contexto", void 0);
class CreateTicketMessageDto {
    usuario_id;
    contenido;
    rol;
}
exports.CreateTicketMessageDto = CreateTicketMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketMessageDto.prototype, "usuario_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketMessageDto.prototype, "contenido", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['usuario', 'agente', 'humano']),
    __metadata("design:type", String)
], CreateTicketMessageDto.prototype, "rol", void 0);
=======
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTicketDto = void 0;
class CreateTicketDto {
    subject;
    priority;
    context;
}
exports.CreateTicketDto = CreateTicketDto;
>>>>>>> main
//# sourceMappingURL=create-ticket.dto.js.map