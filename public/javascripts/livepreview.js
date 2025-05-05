
  document.getElementById('profile-image-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
      // Set the preview to the new image
      document.getElementById('profile-image-preview').src = event.target.result;
    };
    
    if (file) {
      reader.readAsDataURL(file);  // Convert image to base64 and show
    }
  });
