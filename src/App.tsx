// App.tsx
import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import MasonryGrid from './component/MasonryGrid';
import ImageDrawer from './component/ImageDrawer';
import { defaultImages } from './assets/imageData';
import { Image } from './types';


function App() {
  const [images, setImages] = useState<Image[]>(defaultImages);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newImage: Image = { url, id: Date.now() };
      setImages((prev) => [...prev, newImage]);
      setSelectedImage(newImage);
      setDrawerOpen(true);
    }
  };

  const handleImageUpdate = (updatedImage: Image) => {
    setImages((prev) => prev.map((img) => (img.id === updatedImage.id ? updatedImage : img)));
    setSelectedImage(updatedImage);
  };

  const handleImageDelete = (imageId: string | number) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId)); 
  }

  const filteredImages = images.filter((image) =>
    image.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <Box p={2}>
      {drawerOpen ? (
        <ImageDrawer
          open={true}
          image={selectedImage}
          onClose={() => setDrawerOpen(false)}
          onUpdate={handleImageUpdate}
          onDelete={handleImageDelete}
        />
      ) : (
        <>
        <Box> 
          <Box
           sx={{
            display: 'flex',
            flexWrap: "wrap",
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            top: 16,
            left: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: 'white',
            padding: 1,
          }}
          component="div"
          >
            
            <TextField
              label="Search Assets"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              style={{ maxWidth: '500px' }}
            />
            <Button
              variant="contained"
              component="label"
              style={{ backgroundColor: "#334D6E" }}
            >
              + Add
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
          </Box>
          <Box marginTop={10}>
            <MasonryGrid
              images={filteredImages}
              onSelect={(img) => {
                setSelectedImage(img);
                setDrawerOpen(true);
              }}
            />
          </Box>
        </Box>
      </>
      )}
    </Box>
  );
}

export default App;