/**
 * CLOUDINARY SERVICE
 * Handles direct-to-cloud image uploads.
 */
const Cloudinary = {
    cloudName: "dgxx8hsrf", 
    uploadPreset: "APP_UPLOADS", 

    uploadImage: async (fileInput, childId) => {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) return null;
        
        const file = fileInput.files[0];
        const formData = new FormData();
        
        // Essential Fields
        formData.append('file', file);
        formData.append('upload_preset', Cloudinary.uploadPreset);
        
        // Organization
        // If Cloudinary returns 400, try removing 'folder' and see if it works.
        formData.append('folder', `babybloom/${childId}`); 
        
        // Tagging
        formData.append('tags', `child_${childId}`);

        // Note: We removed 'public_id' setting as it often requires specific 
        // Signed/Unsigned permissions that default presets block.
        // We also rely on the Preset's own transformation settings now to avoid 400s.

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${Cloudinary.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!res.ok) {
                const errData = await res.json();
                console.error("Cloudinary Detailed Error:", errData);
                throw new Error(errData.error?.message || "Upload Failed");
            }
            
            const data = await res.json();
            return data.secure_url; 
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            // Fallback: If upload fails, return null so the log is still saved (without image)
            return null;
        }
    }
};
