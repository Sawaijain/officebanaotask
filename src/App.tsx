// App.tsx
import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import MasonryGrid from './component/MasonryGrid';
import ImageDrawer from './component/ImageDrawer';
const image1 = '/images/img1.jpg';
const image2 = '/images/img2.jpg';
const image3 = '/images/img3.jpg';
const image4 = '/images/img4.jpg';
const image5 = '/images/img5.jpg';
const image6 = '/images/img6.jpg';
const image7 = '/images/img7.jpg';
const image8 = '/images/img8.jpg';


export interface Image {
  id: number;
  url: string;
  name?: string;
  description?: string;
}

function App() {

  const defaultImages: Image[] = [
    { id: 1, url: image1, name: 'Default Image 1', description: 'This is a default image.' },
    { id: 2, url: image2, name: 'Default Image 2', description: 'This is another default image.' },
    { id: 3, url: image3, name: 'Default Image 3', description: 'Yet another default image.' },
    { id: 4, url: image4, name: 'Default Image 4', description: 'A fourth default image.' },
    { id: 5, url: image5, name: 'Default Image 4', description: 'A fourth default image.' },
    { id: 6, url: image6, name: 'Default Image 4', description: 'A fourth default image.' },
    { id: 7, url: image7, name: 'Default Image 4', description: 'A fourth default image.' },
    { id: 8, url: image8, name: 'Default Image 4', description: 'A fourth default image.' },
  ];

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