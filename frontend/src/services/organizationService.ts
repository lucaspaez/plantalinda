// services/organizationService.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';

export interface TeamMember {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    organizationId: number;
    organizationName: string;
}

export interface TeamMemberListResponse {
    totalMembers: number;
    maxMembers: number;
    canAddMore: boolean;
    members: TeamMember[];
}

export interface InviteUserRequest {
    email: string;
    firstname: string;
    lastname: string;
    role: string;
}

export interface OrganizationStats {
    organizationId: number;
    organizationName: string;
    plan: string;
    active: boolean;
    userCount: number;
    maxUsers: number | null;
    canAddUsers: boolean;
    maxBatches: number | null;
}

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const organizationService = {
    // Obtener estadísticas de la organización
    async getStats(): Promise<OrganizationStats> {
        const response = await axios.get(`${API_URL}/organization/stats`, getAuthHeader());
        return response.data;
    },

    // Listar miembros del equipo
    async getTeamMembers(): Promise<TeamMemberListResponse> {
        const response = await axios.get(`${API_URL}/organization/members`, getAuthHeader());
        return response.data;
    },

    // Invitar usuario
    async inviteUser(request: InviteUserRequest): Promise<any> {
        const response = await axios.post(
            `${API_URL}/organization/members/invite`,
            request,
            getAuthHeader()
        );
        return response.data;
    },

    // Cambiar rol de usuario
    async updateUserRole(userId: number, newRole: string): Promise<TeamMember> {
        const response = await axios.put(
            `${API_URL}/organization/members/${userId}/role`,
            { newRole },
            getAuthHeader()
        );
        return response.data;
    },

    // Eliminar usuario
    async removeUser(userId: number): Promise<void> {
        await axios.delete(
            `${API_URL}/organization/members/${userId}`,
            getAuthHeader()
        );
    },

    // Obtener información del plan
    async getPlanInfo(): Promise<any> {
        const response = await axios.get(`${API_URL}/organization/plan`, getAuthHeader());
        return response.data;
    },

    isPro(plan: string): boolean {
        return plan === 'PRO' || plan === 'ENTERPRISE';
    }
};
