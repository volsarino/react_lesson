import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import { useState, useEffect } from "react";
const theme = createTheme();
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Home() {
  const navigate = useNavigate(); // ページ遷移用

  return (
    <Stack
      direction="column"
      spacing={3}
      justifyContent="center"
      alignItems="center"
    >
      <h1>gif畑</h1>
      <img src="/images/idiot.gif/" alt="sample gif" className="title-gif" />

      {/* ▼ ボタンを横並びにする Stack */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/next1")}
        >
          gif画像の作り方
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/next2")}
        >
          ギャラリー
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/next3")}
        >
          マイgif
        </Button>
      </Stack>

      <img src="/images/magic meme.gif" alt="sample gif" className="title-gif" />
    </Stack>
  );
}

function NextPage1() {
  return (
    <div>
      <h1>gif画像の作り方</h1>
      <h2>gif画像とは</h2>
      <p>gif画像は、数枚の画像をパラパラ漫画のように連続して表示することで動きを表現している画像フォーマットである。</p>
      <h2>工程</h2>
      <p>連続する画像を数枚撮る、もしくは、作成。<br />
          ↓<br />
          専用のツールやソフト、サイトを使ってアニメーションを作成。<br />
          ↓<br />
          完成！</p>
      <h2>無料で作成できるサイト</h2>
      <p>バナー工房:<a href="https://www.bannerkoubou.com/anime/" target="_blank" rel="noopener noreferrer">https://www.bannerkoubou.com/anime/</a></p>
      <p>LoveGIF:<a href="https://www.lovegif.top/ja/gifmaker" target="_blank" rel="nooperner noreferrer">https://www.lovegif.top/ja/gifmaker</a></p>
      <p>Free Convert GIFメーカー:<a href="https://www.freeconvert.com/ja/gif-maker" target="_blank" rel="nooperner noreferrer">https://www.freeconvert.com/ja/gif-maker</a></p>
    </div>
  );
}
function NextPage2() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/.netlify/functions/listImages")
      .then(res => res.json())
      .then(setImages);
  }, []);

  return (
    <div>
      <h1>ギャラリー</h1>
      <div className="gallery">
        {images.map(id => (
          <div key={id} className="item">
            <img src={`/.netlify/functions/getImage?id=${id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NextPage3() {
  const [uploaded, setUploaded] = useState([]);
  const [selected, setSelected] = useState(null);

  // 初回ロード
  useEffect(() => {
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem("uploadedImages")) || [];
    if (!Array.isArray(stored)) stored = [];
  } catch {
    stored = [];
  }

  const normalized = stored.map(item =>
    typeof item === "string"
      ? { id: Date.now().toString() + Math.random(), src: item }
      : item
  );

  setUploaded(normalized);
}, []);


  // 画像アップロード
  const handleUpload = async (files) => {
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const reader = new FileReader();

    reader.onload = async () => {
      const id = Date.now().toString() + Math.random();

      await fetch("/.netlify/functions/uploadImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          data: reader.result, // base64
        }),
      });
    };

    reader.readAsDataURL(file);
    }
  };


  Promise.all(readers).then(results => {
    const newImages = results.map(src => ({
      id: Date.now().toString() + Math.random(),
      src,
    }));

    setUploaded(prev => {
      const updated = [...prev, ...newImages];
      localStorage.setItem("uploadedImages", JSON.stringify(updated));
      return updated;
    });
  });
};

  // 削除
  const handleDelete = () => {
    if (selected === null) return;
    const updated = uploaded.filter((_, i) => i !== selected);
    setUploaded(updated);
    localStorage.setItem("uploadedImages", JSON.stringify(updated));
    setSelected(null);
  };

  return (
    <div>
      <h1>マイgif</h1>

      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        style={{ marginBottom: 20 }}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          multiple
          onChange={(e) => {
            handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </Button>

      <Button
        variant="contained"
        color="error"
        disabled={selected === null}
        onClick={handleDelete}
        style={{ marginLeft: 20 }}
      >
        選択した画像を削除
      </Button>

      <div className="gallery">
        {uploaded.map((item, index) => (
          <div
            key={item.id}
            className={`item ${selected === index ? "selected" : ""}`}
            onClick={() => setSelected(index)}
          >
            <img src={item.src} alt={`my-${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
}



export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/next1" element={<NextPage1 />} />
          <Route path="/next2" element={<NextPage2 />} />
          <Route path="/next3" element={<NextPage3 />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
