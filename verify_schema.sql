-- Check if ai_model column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'content_queue' 
  AND column_name = 'ai_model';
