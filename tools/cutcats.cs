using System;using System.Drawing;using System.Drawing.Imaging;using System.Collections.Generic;using System.IO;
public class Cut3{
  public static int DARK=175,GROW=8,WIN=34;
  static int Best(int[] proj,int center,int win){int bi=center,bv=int.MaxValue;for(int i=Math.Max(1,center-win);i<=Math.Min(proj.Length-2,center+win);i++){int v=proj[i-1]+proj[i]+proj[i+1];if(v<bv){bv=v;bi=i;}}return bi;}
  public static string Run(string path,string outDir,int cols,int rows,int cw,int chh){
    var bmp=new Bitmap(path);int W=bmp.Width,H=bmp.Height;
    var data=bmp.LockBits(new Rectangle(0,0,W,H),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
    byte[] px=new byte[data.Stride*H];System.Runtime.InteropServices.Marshal.Copy(data.Scan0,px,0,px.Length);bmp.UnlockBits(data);int st=data.Stride;
    bool[] dark=new bool[W*H];
    for(int y=0;y<H;y++)for(int x=0;x<W;x++){int i=y*st+x*4;int mx=Math.Max(px[i],Math.Max(px[i+1],px[i+2]));dark[y*W+x]=mx<DARK;}
    int[] py=new int[H];for(int y=0;y<H;y++)for(int x=0;x<W;x++)if(dark[y*W+x])py[y]++;
    int[] ys=new int[rows+1];ys[0]=0;ys[rows]=H;for(int r=1;r<rows;r++)ys[r]=Best(py,r*H/rows,WIN);
    string log="rows: "+string.Join(",",ys)+"\n";
    int idx=0;
    for(int r=0;r<rows;r++){
      int[] pxp=new int[W];for(int x=0;x<W;x++)for(int y=ys[r];y<ys[r+1];y++)if(dark[y*W+x])pxp[x]++;
      int[] xs=new int[cols+1];xs[0]=0;xs[cols]=W;for(int c=1;c<cols;c++)xs[c]=Best(pxp,c*W/cols,WIN);
      log+="cols r"+r+": "+string.Join(",",xs)+"\n";
      for(int c=0;c<cols;c++){
        idx++;int x0=xs[c],x1=xs[c+1],y0=ys[r],y1=ys[r+1];int w=x1-x0,h=y1-y0;
        bool[] dil=new bool[w*h];
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){if(!dark[(y0+y)*W+x0+x])continue;for(int yy=-GROW;yy<=GROW;yy++)for(int xx=-GROW;xx<=GROW;xx++){int nx=x+xx,ny=y+yy;if(nx<0||ny<0||nx>=w||ny>=h)continue;dil[ny*w+nx]=true;}}
        bool[] fl=new bool[w*h];var q=new Queue<int>();
        for(int x=0;x<w;x++){foreach(int y in new[]{0,h-1}){int p=y*w+x;if(!dil[p]&&!fl[p]){fl[p]=true;q.Enqueue(p);}}}
        for(int y=0;y<h;y++){foreach(int x in new[]{0,w-1}){int p=y*w+x;if(!dil[p]&&!fl[p]){fl[p]=true;q.Enqueue(p);}}}
        int[] dx={1,-1,0,0},dy={0,0,1,-1};
        while(q.Count>0){int p=q.Dequeue();int x=p%w,y=p/w;for(int k=0;k<4;k++){int nx=x+dx[k],ny=y+dy[k];if(nx<0||ny<0||nx>=w||ny>=h)continue;int np=ny*w+nx;if(fl[np]||dil[np])continue;fl[np]=true;q.Enqueue(np);}}
        // 前景 = 外側から届かなかった部分。小さな点は消す
        bool[] fg=new bool[w*h];for(int i=0;i<w*h;i++)fg[i]=!fl[i];
        // 連結成分: 大きいものだけ残す
        int[] lab=new int[w*h];var keep=new bool[w*h];var comps=new List<List<int>>();
        for(int s=0;s<w*h;s++){if(!fg[s]||lab[s]!=0)continue;var comp=new List<int>();var qq=new Queue<int>();qq.Enqueue(s);lab[s]=comps.Count+1;
          while(qq.Count>0){int p=qq.Dequeue();comp.Add(p);int x=p%w,y=p/w;for(int yy=-1;yy<=1;yy++)for(int xx=-1;xx<=1;xx++){int nx=x+xx,ny=y+yy;if(nx<0||ny<0||nx>=w||ny>=h)continue;int np=ny*w+nx;if(!fg[np]||lab[np]!=0)continue;lab[np]=comps.Count+1;qq.Enqueue(np);}}
          comps.Add(comp);}
        int maxA=0;foreach(var cp in comps)maxA=Math.Max(maxA,cp.Count);
        int bx0=w,by0=h,bx1=0,by1=0;
        foreach(var cp in comps){if(cp.Count<maxA/12)continue;foreach(int p in cp){keep[p]=true;int x=p%w,y=p/w;if(x<bx0)bx0=x;if(x>bx1)bx1=x;if(y<by0)by0=y;if(y>by1)by1=y;}}
        // 白い縁（2px）
        bool[] ring=new bool[w*h];int RG=3;
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){if(!keep[y*w+x])continue;for(int yy=-RG;yy<=RG;yy++)for(int xx=-RG;xx<=RG;xx++){if(xx*xx+yy*yy>RG*RG)continue;int nx=x+xx,ny=y+yy;if(nx<0||ny<0||nx>=w||ny>=h)continue;ring[ny*w+nx]=true;}}
        int ax0=Math.Max(0,bx0-RG),ay0=Math.Max(0,by0-RG),ax1=Math.Min(w-1,bx1+RG),ay1=Math.Min(h-1,by1+RG);
        int bw=ax1-ax0+1,bh=ay1-ay0+1;
        var o=new Bitmap(cw,chh,PixelFormat.Format32bppArgb);
        int ox=(cw-bw)/2,oy=chh-bh-2;
        if(bw>cw||bh>chh-2)log+="c"+idx+" too big "+bw+"x"+bh+"\n";
        for(int y=ay0;y<=ay1;y++)for(int x=ax0;x<=ax1;x++){int p=y*w+x;int tx=ox+(x-ax0),ty=oy+(y-ay0);if(tx<0||ty<0||tx>=cw||ty>=chh)continue;
          if(keep[p]){int i=(y0+y)*st+(x0+x)*4;o.SetPixel(tx,ty,Color.FromArgb(255,px[i+2],px[i+1],px[i]));}
          else if(ring[p])o.SetPixel(tx,ty,Color.White);}
        o.Save(Path.Combine(outDir,String.Format("c{0:00}.png",idx)),ImageFormat.Png);o.Dispose();
        log+="c"+idx+" "+bw+"x"+bh+" comps "+comps.Count+"\n";
      }
    }
    return log;
  }
}
