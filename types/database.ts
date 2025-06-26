export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          created_at: string;
          avatar_url?: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          created_at?: string;
          avatar_url?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          created_at?: string;
          avatar_url?: string;
        };
      };
      restrooms: {
        Row: {
          id: string;
          latitude: number;
          longitude: number;
          address: string;
          name: string;
          description?: string;
          accessibility_features: string[];
          operating_hours?: string;
          access_requirements?: string;
          created_by: string;
          status: 'active' | 'inactive' | 'pending_review';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          latitude: number;
          longitude: number;
          address: string;
          name: string;
          description?: string;
          accessibility_features?: string[];
          operating_hours?: string;
          access_requirements?: string;
          created_by: string;
          status?: 'active' | 'inactive' | 'pending_review';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          name?: string;
          description?: string;
          accessibility_features?: string[];
          operating_hours?: string;
          access_requirements?: string;
          created_by?: string;
          status?: 'active' | 'inactive' | 'pending_review';
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          restroom_id: string;
          user_id: string;
          cleanliness_rating: number;
          operational_status: 'working' | 'broken' | 'maintenance';
          visit_date: string;
          comments?: string;
          photos: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          restroom_id: string;
          user_id: string;
          cleanliness_rating: number;
          operational_status: 'working' | 'broken' | 'maintenance';
          visit_date: string;
          comments?: string;
          photos?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          restroom_id?: string;
          user_id?: string;
          cleanliness_rating?: number;
          operational_status?: 'working' | 'broken' | 'maintenance';
          visit_date?: string;
          comments?: string;
          photos?: string[];
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          restroom_id: string;
          user_id: string;
          report_type: 'inappropriate' | 'incorrect_info' | 'closed' | 'other';
          description: string;
          status: 'pending' | 'reviewed' | 'resolved';
          created_at: string;
        };
        Insert: {
          id?: string;
          restroom_id: string;
          user_id: string;
          report_type: 'inappropriate' | 'incorrect_info' | 'closed' | 'other';
          description: string;
          status?: 'pending' | 'reviewed' | 'resolved';
          created_at?: string;
        };
        Update: {
          id?: string;
          restroom_id?: string;
          user_id?: string;
          report_type?: 'inappropriate' | 'incorrect_info' | 'closed' | 'other';
          description?: string;
          status?: 'pending' | 'reviewed' | 'resolved';
          created_at?: string;
        };
      };
    };
  };
}