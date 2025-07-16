import type { CreateRoomResponse, RoomInfoResponse, HealthResponse } from '../types';

/**
 * APIService handles REST API calls to the backend server
 * Features:
 * - Room management
 * - Health checks
 * - Error handling
 * - TypeScript support
 */
class APIService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    console.log('🌐 APIService initialized');
  }

  /**
   * Generic request method with error handling
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      console.log(`🌐 ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ ${options.method || 'GET'} ${endpoint} successful`);
      
      return data;
    } catch (error) {
      console.error(`❌ ${options.method || 'GET'} ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Check server health
   */
  async checkHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  /**
   * Create a new room
   */
  async createRoom(language: string = 'javascript'): Promise<CreateRoomResponse> {
    return this.request<CreateRoomResponse>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({ language })
    });
  }

  /**
   * Get room information
   */
  async getRoomInfo(roomId: string): Promise<RoomInfoResponse> {
    return this.request<RoomInfoResponse>(`/api/rooms/${roomId}`);
  }

  /**
   * Check if server is reachable
   */
  async ping(): Promise<boolean> {
    try {
      await this.checkHealth();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get server base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Update server URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    console.log(`🌐 API base URL updated to: ${url}`);
  }
}

// Create singleton instance
const apiService = new APIService();

export default apiService;
