import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useDrag, useDrop } from 'react-dnd';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, Editor, EditorProvider, Toolbar } from 'react-simple-wysiwyg';
import parse from 'html-react-parser';

// style
const primaryColor = 'rgb(148 163 184)';
const primaryBorder = `2px solid ${primaryColor}`;
const blackBorder = '2px solid black';

// 基本題
const editMode = { None: 'None', Image: 'Image', Text: 'Text' };
const imageName = '圖片元件';
const textName = '文字元件';
const leftPanelButtons = [imageName, textName];
const rightPanelFixedHeader = 'This is a fixed header, no need to modify.';
const defaultImageUrl = 'https://www.meepshop.com/official/_next/static/images/home_elf-12da157a708d28c24e58c3c8d76fe98d.webp';
const defaultImageWidth = 300;
const defaultImageHeight = 300;
const defaultText = 'Hello from MeepShop!';
const dndType = 'StyledButton';

// 加分題一 (輪播元件)
const rightPanelCarouselHeader = '加分題一 ： (輪播元件)  每3秒輪播一張圖';
const carouselImages = [
  'https://ntacademy.sme.gov.tw/wp-content/uploads/2021/08/Meepshop_LOGO-01.png',
  'https://static.accupass.com/userupload/8acaacf9e33641f180dff9a01140708f.jpg',
  'https://s3cdn.yourator.co/banners/banners/000/000/022/home/b5ddc39b63277a80c36b4b00efb19e7bc71c5a87.png',
  'https://img.meepshop.com/xnISTTkCF9pbMRQzSUYPo4KTTmHnI5o_qUx7ieiUW_o/w:1920/Z3M6Ly9pbWcubWVlcGNsb3VkLmNvbS9tZWVwc2hvcC84ODcwYzA4OS1kYzQ2LTQyN2ItYTU4MC1kY2JkMThjMmYxNzMvZmlsZXMvZTU0NTI1YzAtZDY0NS00MDRiLWEzODUtOWJmMmRlZmFlZTM3LmpwZWc',
];

// 加分題二 (WYSIWYG)
const rightPanelRichHeader = '加分題二 ： (WYSIWYG)  左邊是Rich Editor，右邊文字同步顯示即時編輯結果';

function StyledButton({ id, sx, children, setIsDragging, ...props }) {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: dndType,
    item: { id },
  }));

  return (
    <Button
      variant='outlined'
      sx={{ '&.MuiButton-outlined': { color: 'inherit', fontSize: '18px', fontWeight: 'bold', border: blackBorder }, ...sx }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      ref={collected.isDragging ? dragPreview : drag}
      {...(collected.isDragging ? {} : collected)}
      {...props}
    >
      {children}
    </Button>
  );
}

function Separator({ sx, children, ...props }) {
  return (
    <Box sx={{ fontWeight: 'bold', border: blackBorder, textAlign: 'center', ...sx }} {...props}>
      {children}
    </Box>
  );
}

function App() {
  const [collectedProps, drop] = useDrop(() => ({
    accept: dndType,
    drop: ({ id }, monitor) => {
      const showFn = setComponent[id];
      showFn(true);
    },
  }));

  const [mode, setMode] = useState(editMode.None);
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);
  const [imageWidth, setImageWidth] = useState(defaultImageWidth);
  const [imageHeight, setImageHeight] = useState(defaultImageHeight);
  const [text, setText] = useState(defaultText);

  const [isDragging, setIsDragging] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showText, setShowText] = useState(false);
  const setComponent = [setShowImage, setShowText];

  const [richEditorValue, setRichEditorValue] = useState(defaultText);

  const handleRichEditorChange = e => {
    setRichEditorValue(e.target.value);
  };

  return (
    <PanelGroup autoSaveId='PanelGroup' direction='horizontal' style={{ height: '100vh' }}>
      <Panel defaultSize={30} minSize={20}>
        <Stack direction='column' spacing={5} sx={{ height: '100%', justifyContent: 'center' }}>
          {mode === editMode.None &&
            leftPanelButtons.map((btnText, id) => (
              <StyledButton key={id} id={id} setIsDragging={setIsDragging}>
                {btnText}
              </StyledButton>
            ))}
          {mode === editMode.Image && (
            <TextField
              variant='outlined'
              label='Width (px)'
              defaultValue={imageWidth}
              onChange={e => setImageWidth(e.target.value)}
              slotProps={{ htmlInput: { type: 'number' } }}
            ></TextField>
          )}
          {mode === editMode.Image && (
            <TextField
              variant='outlined'
              label='Height (px)'
              defaultValue={imageHeight}
              onChange={e => setImageHeight(e.target.value)}
              slotProps={{ htmlInput: { type: 'number' } }}
            ></TextField>
          )}
          {mode === editMode.Image && (
            <TextField
              variant='outlined'
              label='Image URL'
              defaultValue={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              slotProps={{ htmlInput: { type: 'url' } }}
            ></TextField>
          )}
          {mode === editMode.Text && (
            <TextField variant='outlined' label='Text' defaultValue={text} onChange={e => setText(e.target.value)}></TextField>
          )}
        </Stack>
      </Panel>
      <PanelResizeHandle style={{ width: '0.125rem', backgroundColor: primaryColor }} />
      <Panel minSize={30} style={{ overflow: 'scroll' }}>
        {/* 基本題 */}
        <Separator>{rightPanelFixedHeader}</Separator>
        <Stack
          direction='column'
          spacing={5}
          sx={{ minHeight: '70%', justifyContent: 'flex-start', bgcolor: isDragging ? primaryColor : 'inherit' }}
          ref={drop}
        >
          {showImage && (
            <Tooltip title={imageName} placement='right'>
              <Box
                component='img'
                sx={{
                  px: 1,
                  mt: 1,
                  width: `${imageWidth}px`,
                  height: `${imageHeight}px`,
                  objectFit: 'cover',
                  overflow: 'auto',
                  '&:hover': { border: primaryBorder },
                }}
                src={imageUrl}
                onClick={() => setMode(editMode.Image)}
              />
            </Tooltip>
          )}
          {showText && (
            <Tooltip title={textName} placement='bottom'>
              <Typography sx={{ px: 1, mt: 1, '&:hover': { border: primaryBorder } }} onClick={() => setMode(editMode.Text)}>
                {text}
              </Typography>
            </Tooltip>
          )}
        </Stack>

        {/* 加分題一 (輪播元件) */}
        <Separator>{rightPanelCarouselHeader}</Separator>
        <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay stopOnHover={false}>
          {carouselImages.map(img => (
            <Box
              key={img}
              component='img'
              sx={{
                width: `600px`,
                height: `300px`,
                objectFit: 'contain',
                overflow: 'hidden',
              }}
              src={img}
            />
          ))}
        </Carousel>

        {/* 加分題二 (WYSIWYG) */}
        <Separator sx={{ mt: 5 }}>{rightPanelRichHeader}</Separator>
        <Stack direction='row' spacing={5} sx={{ mb: 5, justifyContent: 'flex-start' }}>
          <EditorProvider>
            <Editor value={richEditorValue} onChange={handleRichEditorChange}>
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <BtnStrikeThrough />
              </Toolbar>
            </Editor>
          </EditorProvider>
          <Typography sx={{ pt: 5 }}>{parse(richEditorValue)}</Typography>
        </Stack>
      </Panel>
    </PanelGroup>
  );
}

export default App;
