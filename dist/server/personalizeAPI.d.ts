import { Request, Response } from 'express';
export declare class PersonalizeAPI {
    /**
     * GET /api/personalize - Get personalized content for a specific chapter and user
     */
    static getPersonalize(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * POST /api/personalize - Personalize provided content based on user profile
     */
    static postPersonalize(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /api/personalization-settings - Get current personalization settings for a user
     */
    static getPersonalizationSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * PUT /api/personalization-settings - Update personalization settings for a user
     */
    static putPersonalizationSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * POST /api/personalize/batch - Personalize multiple chapters for a user
     */
    static postBatchPersonalize(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=personalizeAPI.d.ts.map