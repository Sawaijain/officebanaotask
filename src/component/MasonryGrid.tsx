import { Box, useMediaQuery, useTheme } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/system';
import { Image } from '../App';

const ImagePreview = styled('img')({
  maxWidth: '100%',
  borderRadius: '8px',
  cursor: 'pointer',
});

type MasonryGridProps = {
  images: Image[];
  onSelect: (image: Image) => void;
};

function MasonryGrid({ images, onSelect }: MasonryGridProps) {
  const theme = useTheme();

  
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const columns = isLargeScreen ? 5 : isMediumScreen ? 3 : isSmallScreen ? 2 : 1;

  return (
    <Box mt={4}>
      <Masonry columns={columns} spacing={2}>
        {images.map((image) => (
          <ImagePreview
            key={image.id}
            src={image.url}
            alt={`Uploaded asset ${image.id}`}
            onClick={() => onSelect(image)}
          />
        ))}
      </Masonry>
    </Box>
  );
}

export default MasonryGrid;