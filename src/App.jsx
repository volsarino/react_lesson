import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import { useState, useEffect } from "react";

const theme = createTheme();

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
});

function Home() {
  const navigate = useNavigate();

  return (
    <Stack direction="column" spacing={3} justifyContent="center" alignItems="center">
      <h1>マイキャンバス</h1>

      <img src="/images/idiot.gif" alt="sample gif" className="title-gif" />

      <Stack direction="row" spacing={2}>
        <Button variant="contained" size="large" onClick={() => navigate("/next1")}>
          gif画像の作り方
        </Button>

        {/* Page2 削除済み */}
        <Button variant="contained" size="large" onClick={() => navigate("/next3")}>
          画集
        </Button>
      </Stack>

      <img src="/images/magic meme.gif" alt="sample gif" className="title-gif" />
    </Stack>
  );
}

function NextPage1() {
  return (
    <div>
      <h1>ガイドライン</h1>
      <h2>1.本サイトについて</h2>
      <p>このサイトは、写真や絵、gif画像を作ったり、お気に入りの画像をサイト上に自由にアップロードし、思い出や表現の場とするものである。</p>
      <h2>2.サイトの使い方</h2>
      <p></p>
      <h2>3.gif画像とは</h2>　
      <p>
        gif画像は、数枚の画像をパラパラ漫画のように連続して表示することで
        動きを表現している画像フォーマットである。
      </p>
      <h2>工程</h2>
      <p>連続する画像を数枚撮る、もしくは、作成。<br/>
      ↓<br/>
      専用のツールやソフト、サイトを使ってアニメーションを作成。<br/>
      ↓<br/>
      完成!</p>
      <h2>無料で作成できるサイト</h2>
      <p>バナー工房:<a href="https://www.bannerkoubou.com/anime/" target="_blank" rel="noopener noreferrer">https://www.bannerkoubou.com/anime/</a></p>
      <p>LoveGIF:<a href="https://www.lovegif.top/ja/gifmaker" target="_blank" rel="nooperner noreferrer">https://www.lovegif.top/ja/gifmaker</a></p>
      <p>Free Convert GIFメーカー:<a href="https://www.freeconvert.com/ja/gif-maker" target="_blank" rel="nooperner noreferrer">https://www.freeconvert.com/ja/gif-maker</a></p>
    </div>
  );
}

/* ==========================================
   Page3（ローカル保存・表示のみ）
   ========================================== */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
function NextPage3() {
  const [myImages, setMyImages] = useState([]);
  const [selected, setSelected] = useState(null);

    console.log("CLOUD_NAME =", CLOUD_NAME);
  console.log("UPLOAD_PRESET =", UPLOAD_PRESET);

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    alert("Cloudinary の設定が読み込まれていません。\n.env ファイルを確認してください。");
  }

  // 初回ロード（Cloudinary 情報を読み込み）
  useEffect(() => {
    const stored = localStorage.getItem("myCloudImages");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setMyImages(parsed);
    } catch (e) {
      console.error("読み込み失敗", e);
    }
  }, []);

  // Cloudinary へアップロード
  const handleUpload = async (files) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const title = prompt("この画像のタイトルを入力してください");

      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);

      // 🔹 Cloudinary の context に title を保存
      if (title) {
        form.append("context", `title=${title}`);
      }

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: form }
        );

        const data = await res.json();

        // Cloudinary から返る値
        //  secure_url … 最適化CDN URL
        //  public_id  … 削除 / 更新で使用
        const newItem = {
          url: data.secure_url,
          publicId: data.public_id,
          title: title || "",
        };

        setMyImages((prev) => {
          const updated = [...prev, newItem];
          localStorage.setItem("myCloudImages", JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        console.error("アップロード失敗", err);
        alert("アップロードに失敗しました");
      }
    }
  };

  // （今回は Cloudinary から削除せず、ローカル一覧からのみ削除）
  const handleDelete = () => {
    if (selected === null) return;
    const updated = myImages.filter((_, i) => i !== selected);
    setMyImages(updated);
    localStorage.setItem("myCloudImages", JSON.stringify(updated));
    setSelected(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>画集（Cloudinary 保存）</h1>

      <Stack direction="row" spacing={2} justifyContent="center" style={{ marginBottom: 20 }}>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload files
          <VisuallyHiddenInput
            type="file"
            multiple
            accept="image/gif,image/jpeg,image/png"
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
        >
          選択した画像を削除（ローカル一覧のみ）
        </Button>
      </Stack>

      <div className="gallery">
        {myImages.length === 0 && (
          <p style={{ textAlign: "center", width: "100%" }}>画像がありません</p>
        )}

        {myImages.map((img, index) => (
          <div
            key={img.publicId}
            className={`item ${selected === index ? "selected" : ""}`}
            onClick={() => setSelected(index)}
          >
            <img
              src={img.url}
              alt={img.title || `image-${index}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* 🔹 選択画像のタイトル表示 */}
      {selected !== null && (
        <p style={{ textAlign: "center", marginTop: 10 }}>
          タイトル：{myImages[selected].title || "(未設定)"}
        </p>
      )}
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

          {/* Page2 削除 */}
          {/* <Route path="/next2" element={<NextPage2 />} /> */}

          <Route path="/next3" element={<NextPage3 />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
