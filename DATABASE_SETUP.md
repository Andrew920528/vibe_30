# Database Setup Guide

This guide will help you set up the Supabase database for Vibe-30 bucket storage.

## 1. Create Database Tables

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-schema.sql` into the editor
4. Click **Run** to execute the SQL

This will create:

- `buckets` table for storing user buckets
- `activities` table for storing activities within buckets
- Proper indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

## 2. Verify Tables Created

After running the SQL, you should see these tables in your **Table Editor**:

### `buckets` table:

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### `activities` table:

- `id` (UUID, Primary Key)
- `bucket_id` (UUID, Foreign Key to buckets)
- `text` (Text)
- `position` (Integer)
- `created_at` (Timestamp)

## 3. Test the Setup

1. **Start your development server**: `npm run dev`
2. **Sign in to your app**
3. **Create a new bucket** - it should save to the database
4. **Add activities** - they should be stored with proper positioning
5. **Sign out and sign back in** - your buckets should persist

## 4. Database Features

### ✅ **Row Level Security (RLS)**

- Users can only see their own buckets
- Users can only modify their own data
- Automatic user isolation

### ✅ **Automatic Timestamps**

- `created_at` set when bucket is created
- `updated_at` automatically updated on changes

### ✅ **Activity Positioning**

- Activities are stored with position numbers
- Drag and drop updates positions in database
- Proper ordering maintained

### ✅ **Cascade Deletion**

- Deleting a bucket removes all its activities
- Deleting a user removes all their buckets

## 5. Troubleshooting

### If buckets aren't saving:

1. Check that RLS policies are enabled
2. Verify user authentication is working
3. Check browser console for errors
4. Ensure Supabase environment variables are set

### If you see permission errors:

1. Make sure you're signed in
2. Check that RLS policies are correctly set up
3. Verify the user_id is being set correctly

### If activities aren't ordering correctly:

1. Check that the position field is being updated
2. Verify the drag and drop is calling the database
3. Check that activities are being sorted by position

## 6. Environment Variables

Make sure your `.env` file contains:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 7. Next Steps

Once the database is set up:

- Buckets will persist across sessions
- Users can access their buckets from any device
- Data is securely isolated per user
- Ready for sharing features (future enhancement)

The app now uses Supabase for all data storage instead of localStorage!
