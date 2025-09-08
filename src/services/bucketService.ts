import { supabase } from "../../supabase";

export interface Activity {
  id: string;
  text: string;
  description?: string;
  position: number;
}

export interface Bucket {
  id: string;
  name: string;
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBucketData {
  name: string;
  activities: Array<{ text: string; description?: string }>;
}

export interface UpdateBucketData {
  name?: string;
  activities?: Activity[];
}

class BucketService {
  // Get all buckets for the current user
  async getBuckets(): Promise<Bucket[]> {
    try {
      const { data: buckets, error: bucketsError } = await supabase
        .from("buckets")
        .select(
          `
          id,
          name,
          created_at,
          updated_at,
          activities (
            id,
            text,
            description,
            position
          )
        `
        )
        .order("created_at", { ascending: false });

      if (bucketsError) {
        console.error("Error fetching buckets:", bucketsError);
        throw bucketsError;
      }

      return buckets.map((bucket) => ({
        id: bucket.id,
        name: bucket.name,
        activities: bucket.activities
          .sort((a, b) => a.position - b.position)
          .map((activity) => ({
            id: activity.id,
            text: activity.text,
            description: activity.description,
            position: activity.position,
          })),
        createdAt: new Date(bucket.created_at),
        updatedAt: new Date(bucket.updated_at),
      }));
    } catch (error) {
      console.error("Error in getBuckets:", error);
      throw error;
    }
  }

  // Create a new bucket with activities
  async createBucket(bucketData: CreateBucketData): Promise<Bucket> {
    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Start a transaction by creating the bucket first
      const { data: bucket, error: bucketError } = await supabase
        .from("buckets")
        .insert({
          name: bucketData.name,
          user_id: user.id,
        })
        .select()
        .single();

      if (bucketError) {
        console.error("Error creating bucket:", bucketError);
        throw bucketError;
      }

      // Create activities for the bucket
      if (bucketData.activities.length > 0) {
        const activitiesData = bucketData.activities.map((activity, index) => ({
          bucket_id: bucket.id,
          text: activity.text,
          description: activity.description || null,
          position: index,
        }));

        const { error: activitiesError } = await supabase
          .from("activities")
          .insert(activitiesData);

        if (activitiesError) {
          console.error("Error creating activities:", activitiesError);
          // If activities creation fails, delete the bucket
          await supabase.from("buckets").delete().eq("id", bucket.id);
          throw activitiesError;
        }
      }

      // Fetch the complete bucket with activities
      const completeBucket = await this.getBucketById(bucket.id);
      return completeBucket;
    } catch (error) {
      console.error("Error in createBucket:", error);
      throw error;
    }
  }

  // Get a single bucket by ID
  async getBucketById(bucketId: string): Promise<Bucket> {
    try {
      const { data: bucket, error } = await supabase
        .from("buckets")
        .select(
          `
          id,
          name,
          created_at,
          updated_at,
          activities (
            id,
            text,
            description,
            position
          )
        `
        )
        .eq("id", bucketId)
        .single();

      if (error) {
        console.error("Error fetching bucket:", error);
        throw error;
      }

      return {
        id: bucket.id,
        name: bucket.name,
        activities: bucket.activities.sort((a, b) => a.position - b.position),
        createdAt: new Date(bucket.created_at),
        updatedAt: new Date(bucket.updated_at),
      };
    } catch (error) {
      console.error("Error in getBucketById:", error);
      throw error;
    }
  }

  // Update a bucket
  async updateBucket(
    bucketId: string,
    updates: UpdateBucketData
  ): Promise<Bucket> {
    try {
      // Update bucket name if provided
      if (updates.name !== undefined) {
        const { error: bucketError } = await supabase
          .from("buckets")
          .update({ name: updates.name })
          .eq("id", bucketId);

        if (bucketError) {
          console.error("Error updating bucket name:", bucketError);
          throw bucketError;
        }
      }

      // Update activities if provided
      if (updates.activities !== undefined) {
        // Delete existing activities
        const { error: deleteError } = await supabase
          .from("activities")
          .delete()
          .eq("bucket_id", bucketId);

        if (deleteError) {
          console.error("Error deleting activities:", deleteError);
          throw deleteError;
        }

        // Insert new activities
        if (updates.activities.length > 0) {
          const activitiesData = updates.activities.map((activity) => ({
            bucket_id: bucketId,
            text: activity.text,
            position: activity.position,
          }));

          const { error: insertError } = await supabase
            .from("activities")
            .insert(activitiesData);

          if (insertError) {
            console.error("Error inserting activities:", insertError);
            throw insertError;
          }
        }
      }

      // Return the updated bucket
      return await this.getBucketById(bucketId);
    } catch (error) {
      console.error("Error in updateBucket:", error);
      throw error;
    }
  }

  // Delete a bucket
  async deleteBucket(bucketId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("buckets")
        .delete()
        .eq("id", bucketId);

      if (error) {
        console.error("Error deleting bucket:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in deleteBucket:", error);
      throw error;
    }
  }

  // Add a single activity to a bucket
  async addActivity(
    bucketId: string,
    text: string,
    description?: string
  ): Promise<Activity> {
    try {
      // Get the current max position
      const { data: maxPositionData, error: maxError } = await supabase
        .from("activities")
        .select("position")
        .eq("bucket_id", bucketId)
        .order("position", { ascending: false })
        .limit(1);

      if (maxError) {
        console.error("Error getting max position:", maxError);
        throw maxError;
      }

      const nextPosition =
        maxPositionData.length > 0 ? maxPositionData[0].position + 1 : 0;

      const { data: activity, error } = await supabase
        .from("activities")
        .insert({
          bucket_id: bucketId,
          text,
          description: description || null,
          position: nextPosition,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding activity:", error);
        throw error;
      }

      return {
        id: activity.id,
        text: activity.text,
        description: activity.description,
        position: activity.position,
      };
    } catch (error) {
      console.error("Error in addActivity:", error);
      throw error;
    }
  }

  // Remove a single activity from a bucket
  async removeActivity(activityId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", activityId);

      if (error) {
        console.error("Error removing activity:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in removeActivity:", error);
      throw error;
    }
  }
}

export const bucketService = new BucketService();
