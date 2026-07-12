"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const support_service_1 = require("./support.service");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const create_message_dto_1 = require("./dto/create-message.dto");
const create_kb_entry_dto_1 = require("./dto/create-kb-entry.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SupportController = class SupportController {
    supportService;
    constructor(supportService) {
        this.supportService = supportService;
    }
    createTicket(req, dto) {
        return this.supportService.createTicket(req.user.id, dto);
    }
    findTickets(req) {
        return this.supportService.findTickets(req.user.id);
    }
    findTicketById(req, id) {
        return this.supportService.findTicketById(req.user.id, id);
    }
    addTicketMessage(req, id, dto) {
        return this.supportService.addTicketMessage(req.user.id, id, dto);
    }
    createKnowledgeBaseEntry(dto) {
        return this.supportService.createKnowledgeBaseEntry(dto);
    }
    findKnowledgeBase() {
        return this.supportService.findKnowledgeBase();
    }
};
exports.SupportController = SupportController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('tickets'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "createTicket", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('tickets'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "findTickets", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('tickets/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "findTicketById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('tickets/:id/messages'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "addTicketMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('knowledge-base'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kb_entry_dto_1.CreateKbEntryDto]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "createKnowledgeBaseEntry", null);
__decorate([
    (0, common_1.Get)('knowledge-base'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "findKnowledgeBase", null);
exports.SupportController = SupportController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportController);
//# sourceMappingURL=support.controller.js.map