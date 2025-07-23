import { supabase } from './supabase';
import { Database } from '@/types/database';

type Restroom = Database['public']['Tables']['restrooms']['Row'];
type RestroomInsert = Database['public']['Tables']['restrooms']['Insert'];
type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export const restroomService = {
  async getNearbyRestrooms(latitude: number, longitude: number, radius: number = 5000) {
    console.log('Getting nearby restrooms:', { latitude, longitude, radius });
    
    try {
      // First, let's try the RPC function
      const { data, error } = await supabase
        .rpc('get_nearby_restrooms', {
          lat: latitude,
          lng: longitude,
          radius_meters: radius,
        });

      if (error) {
        console.error('RPC function error:', error);
        // Fallback to simple query if RPC fails
        console.log('Falling back to simple query...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('restrooms')
          .select('*')
          .eq('status', 'active');
        
        if (fallbackError) throw fallbackError;
        console.log('Fallback query found restrooms:', fallbackData?.length || 0);
        return fallbackData as Restroom[];
      }
      
      console.log('Found restrooms via RPC:', data?.length || 0);
      return data as Restroom[];
    } catch (error) {
      console.error('Error in getNearbyRestrooms:', error);
      
      // Final fallback - get all active restrooms
      console.log('Using final fallback - getting all active restrooms...');
      const { data: allData, error: allError } = await supabase
        .from('restrooms')
        .select('*')
        .eq('status', 'active')
        .limit(50);
      
      if (allError) {
        console.error('Final fallback error:', allError);
        throw allError;
      }
      
      console.log('Final fallback found restrooms:', allData?.length || 0);
      return allData as Restroom[];
    }
  },

  async getRestroom(id: string) {
    console.log('Getting restroom:', id);
    
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
    console.log('Retrieved restroom:', data);
    return data;
  },

  async createRestroom(restroom: RestroomInsert) {
    console.log('Creating restroom:', restroom);
    
    // Validate required fields
    if (!restroom.name || !restroom.address || !restroom.latitude || !restroom.longitude || !restroom.created_by) {
      throw new Error('Missing required fields: name, address, location, or user ID');
    }
    
    const { data, error } = await supabase
      .from('restrooms')
      .insert(restroom)
      .select()
      .single();

    if (error) {
      console.error('Error creating restroom:', error);
      throw error;
    }
    
    console.log('Restroom created successfully:', data);
    return data;
  },

  async updateRestroom(id: string, updates: Partial<RestroomInsert>) {
    console.log('Updating restroom:', id, updates);
    
    const { data, error } = await supabase
      .from('restrooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    console.log('Restroom updated:', data);
    return data;
  },

  async createReview(review: ReviewInsert) {
    console.log('Creating review:', review);
    
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    console.log('Review created:', data);
    return data;
  },

  async getReviews(restroomId: string) {
    console.log('Getting reviews for restroom:', restroomId);
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (username)
      `)
      .eq('restroom_id', restroomId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log('Found reviews:', data?.length || 0);
    return data;
  },

  async reportRestroom(restroomId: string, userId: string, reportType: string, description: string) {
    console.log('Creating report:', { restroomId, userId, reportType, description });
    
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
    console.log('Report created:', data);
    return data;
  },
};