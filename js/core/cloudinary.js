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
        const timestamp = new Date().getTime();
        
        // Construct Custom Filename: contactID-timestamp
        const contactID = (typeof STATE !== 'undefined' && STATE.user && STATE.user.id) ? STATE.user.id : 'unknown_user';
        const customFileName = `${contactID}-${timestamp}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', Cloudinary.uploadPreset);
        formData.append('folder', 'APP_UPLOADS'); 
        
        // FORCE CUSTOM FILENAME
        formData.append('public_id', customFileName);
        
        // TAGS for management
        formData.append('tags', `child_${childId},user_${contactID}`);

        // FORCE OPTIMIZATION via API parameters
        formData.append('transformation', 'f_auto,q_auto'); 

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${Cloudinary.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!res.ok) throw new Error("Cloudinary Upload Failed");
            
            const data = await res.json();
            return data.secure_url; 
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            return null;
        }
    }
};
