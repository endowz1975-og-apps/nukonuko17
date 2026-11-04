# 猫の絵からアプリのアイコン（192/512）を作る。使い方: powershell -File tools/mkicon.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot
$cat = [System.Drawing.Image]::FromFile((Join-Path $root 'cat/c17.png'))
foreach ($n in 192, 512) {
  $bmp = New-Object System.Drawing.Bitmap $n, $n
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'; $g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#0d0b0a'))
  $pen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#d4a017')), ($n * 0.025)
  $m = $n * 0.06
  $g.DrawRectangle($pen, $m, $m, $n - 2 * $m, $n - 2 * $m)
  $s = $n * 0.72; $o = ($n - $s) / 2
  $g.DrawImage($cat, [single]$o, [single]$o, [single]$s, [single]$s)
  $bmp.Save((Join-Path $root "tools/pwa/icon-$n.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}
$cat.Dispose()
