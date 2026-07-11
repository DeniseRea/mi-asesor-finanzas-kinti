import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        currency: string;
    }>;
    updateProfile(req: any, body: {
        phone?: string;
        currency?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        currency: string;
    }>;
}
