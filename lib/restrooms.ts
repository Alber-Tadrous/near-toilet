import { supabase } from './supabase';
import { Database } from '@/types/database';

type Restroom = Database['public']['Tables']['restrooms']['Row'];
type RestroomInsert = Database['public']['Tables']['restrooms']['Insert'];
type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export const restroomService = {
  async getNearbyRestrooms(latitude: number, longitude: number, radius: number = 5000) {
    const { data, error } = await supabase
      .rpc('get_nearby_restrooms', {
        lat: latitude,
        lng: longitude,
        radius_meters: radius,
      });

    if (error) throw error;
    return data as Restroom[];
  },

  async getRestroom(id: string) {
    const { data, error } = await supabase
      .from('restrooms')
      .select(`
        *,
        reviews (
          id,
          cleanliness_rating,
          operational_status,
          visit_date,
          comments,
          photos,
          created_at,
          users (username)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createRestroom(restroom: RestroomInsert) {
    const { data, error } = await supabase
      .from('restrooms')
      .insert(restroom)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRestroom(id: string, updates: Partial<RestroomInsert>) {
    const { data, error } = await supabase
      .from('restrooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createReview(review: ReviewInsert) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getReviews(restroomId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (username)
      `)
      .eq('restroom_id', restroomId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async reportRestroom(restroomId: string, userId: string, reportType: string, description: string) {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        restroom_id: restroomId,
        user_id: userId,
        report_type: reportType as any,
        description,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};