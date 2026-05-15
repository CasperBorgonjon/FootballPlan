import { useState } from 'react';
// import { supabase } from '../lib/supabase';

// Progress photo log.
// Stub. Backed by Supabase Storage bucket `progress_photos` plus a
// `photo_log` table: (user_id, taken_on, storage_path, caption, tag).
export function usePhotoLog(_userId) {
  const [photos, _setPhotos] = useState([]);

  async function upload(_file, _meta) {
    // const path = `${userId}/${Date.now()}_${file.name}`;
    // await supabase.storage.from('progress_photos').upload(path, file);
    // await supabase.from('photo_log').insert({ user_id: userId, storage_path: path, ...meta });
    // refresh()
  }

  async function remove(_id) { /* delete row + storage object */ }

  return { photos, upload, remove };
}
