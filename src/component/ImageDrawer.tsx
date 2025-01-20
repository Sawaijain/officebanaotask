import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { RotateLeft, RotateRight, Flip } from '@mui/icons-material';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import type { Image } from '../App';

type ImageDrawerProps = {
  open: boolean;
  image: Image | null;
  onClose: () => void;
  onUpdate: (updatedImage: Image) => void;
  onDelete: (imageId: string | number) => void;
};

function ImageDrawer({ open, image, onClose, onUpdate, onDelete }: ImageDrawerProps) {
  const [assetName, setAssetName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editImage, setEditImage] = useState<Image | null>(null);
  const [assetNameError, setAssetNameError] = useState<string>('');

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    if (image) {
      setEditImage({ ...image });
      setAssetName(image.name || '');
      setDescription(image.description || '');
    }
  }, [image]);

  // @ts-ignore
  const handleCropComplete = (croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleApplyCrop = async () => {
    if (editImage && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(editImage.url, croppedAreaPixels);
      if (croppedImage) {
        const updatedImage = { ...editImage, url: croppedImage };
        setEditImage(updatedImage);
        onUpdate(updatedImage);
        setIsCropping(false);
      }
    }
  };


  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (editImage) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = editImage.url;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx?.save();
        if (direction === 'horizontal') {
          ctx?.scale(-1, 1);
          ctx?.drawImage(img, -img.width, 0);
        } else if (direction === 'vertical') {
          ctx?.scale(1, -1);
          ctx?.drawImage(img, 0, -img.height);
        }
        ctx?.restore();

        const flippedUrl = canvas.toDataURL();
        setEditImage({ ...editImage, url: flippedUrl });
      };
    }
  };

  const handleRotation = (angle: number) => {
    if (editImage) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = editImage.url;
      img.onload = () => {
        if (angle === 90 || angle === -90) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        ctx?.translate(canvas.width / 2, canvas.height / 2);
        ctx?.rotate((angle * Math.PI) / 180);
        ctx?.drawImage(img, -img.width / 2, -img.height / 2);

        const rotatedUrl = canvas.toDataURL();
        setEditImage({ ...editImage, url: rotatedUrl });
      };
    }
  };

  const handleSave = () => {
    if (!assetName.trim()) {
      setAssetNameError('Asset name is required.');
      return;
    }

    setAssetNameError(''); 
    if (editImage) {
      onUpdate({ ...editImage, name: assetName, description });
      onClose();
    }
  };

  const handleDelete = () => {
    if (editImage) {
      onDelete(editImage.id);  
      onClose(); 
    }
  };

  const handleReplaceImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      if (editImage) {
        const updatedImage = { ...editImage, url: newImageUrl };
        setEditImage(updatedImage);
        onUpdate(updatedImage);
      }
    }
  };

  return (

    <Drawer anchor="right" open={open} onClose={onClose}
    PaperProps={{
      style: {
        width: '100%',
        maxWidth: '100%',  
      },
    }}
    >
      <Box display="flex" height="100%">
       
        <Box
          width="70%"
          bgcolor="#f5f5f5"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
        >
          {editImage && (
            <>
              {isCropping ? (
                <Box position="relative" width="100%" height="100%">
                  <Cropper
                    image={editImage.url}
                    crop={crop}
                    zoom={zoom}
                    // aspect={4 / 3} 
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  
                  />
                  <Typography gutterBottom>Zoom</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleApplyCrop}
                  >
                    Apply Crop
                  </Button>
                </Box>
              ) : (
                <img
                  src={editImage.url}
                  alt="Selected"
                  style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
                />
              )}
            </>
          )}
        </Box>

        <Box
          width="30%"
          p={3}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography variant="h6" gutterBottom>
            Edit Image
          </Typography>

          <TextField
            label="Asset Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            error={!!assetNameError}  
            helperText={assetNameError} 
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box display="flex" style={{flexWrap:"wrap"}} justifyContent="space-around" mt={2}>
            <IconButton color="primary" onClick={() => handleRotation(-90)}>
              <RotateLeft />
            </IconButton>
            <IconButton color="primary" onClick={() => handleRotation(90)}>
              <RotateRight />
            </IconButton>
            <IconButton color="primary" onClick={() => handleFlip('horizontal')}>
              <Flip />
            </IconButton>
            <IconButton color="primary" onClick={() => handleFlip('vertical')}>
              <Flip />
            </IconButton>
            <IconButton color="primary" onClick={() => setIsCropping(true)}>
              Crop
            </IconButton>
          </Box>

          <Box display="flex" style={{flexWrap:"wrap"}} justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDelete}
              style={{ width: '48%',marginBottom:"3px" }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ width: '48%' }}
            >
              Save 
            </Button>
          </Box>
          <Button
              variant="outlined"
              color="primary"
              component="label"
              style={{ width: '100%' }}
            >
              Replace Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleReplaceImage}
              />
            </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default ImageDrawer;
